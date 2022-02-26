import { ScriptCheck } from "python";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Exercise {
	@PrimaryGeneratedColumn("uuid")
	public uuid!: string;

	@Column("number", { nullable: false, unique: true })
	public number!: number;

	@Column("text", { nullable: false})
	public title!: string;

	@Column("text", { nullable: false})
	public objective!: string;

	@Column("text", { nullable: false})
	public markdown!: string;

	@Column("text", { nullable: false})
	public shellCode!: string;

	@Column("simple-json", { nullable: false })
	public check!: ScriptCheck;
}
