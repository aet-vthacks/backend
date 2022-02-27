import { User } from "models";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pet {
	@PrimaryGeneratedColumn("uuid")
	public uuid!: string;

	@Column("text", { nullable: false })
	public name!: string;

	@Column("simple-json", { nullable: false })
	public colors!: (string | undefined)[];

	@Column("text", { nullable: false })
	public rarity!: string;

	@Column("text", { nullable: false })
	public species!: string;

	@ManyToOne(() => User, user => user.pets)
	public user!: User;
}
