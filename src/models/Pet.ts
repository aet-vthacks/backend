import { User } from "models";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pet {
	@PrimaryGeneratedColumn("uuid")
	public uuid!: string;

	@Column("text", { nullable: false, unique: true })
	public name!: string;

	@ManyToOne(type => User, user => user.pets)
	public user!: User;
}
