import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {
	@PrimaryGeneratedColumn("uuid")
	public uuid!: string;

	@Column("text", { nullable: false, unique: true })
	public sessionId!: string;

	@Column("simple-json")
	public sessionData!: any;
}
