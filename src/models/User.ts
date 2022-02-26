import { Pet } from "models";
import { BinaryLike, pbkdf2Sync, randomBytes } from "node:crypto";
import { FailedInterpret, SuccessfulInterpret } from "python";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	public uuid!: string;

	@Column("text", { nullable: false })
	private passwordSalt!: string;

	@Column("text", { nullable: false })
	private passwordHash!: string;

	@Column("text", { nullable: false, unique: true })
	public email!: string;

	@Column("text", { nullable: false, unique: true })
	public firstname!: string;

	@Column("text", { nullable: false, unique: true })
	public lastname!: string;

	@OneToMany(() => Pet, pet => pet.user)
	public pets!: Pet[];

	@Column("simple-json", { nullable: true })
	public codeSaves!: {
		exerciseUUID: string,
		code: string,
		completed: boolean
		testStatus: SuccessfulInterpret | FailedInterpret
	}[];

	generatePassword(password: BinaryLike): void {
		const salt = randomBytes(16);
		this.passwordSalt = salt.toString("hex");

		const hash = pbkdf2Sync(password, this.passwordSalt, 1000, 64, "sha512");
		this.passwordHash = hash.toString("hex");
	}

	validatePassword(password: BinaryLike): boolean {
		const hash = pbkdf2Sync(password, this.passwordSalt, 1000, 64, "sha512");
		return this.passwordHash === hash.toString("hex");
	}
}
