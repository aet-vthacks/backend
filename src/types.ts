import { Request } from "@tinyhttp/app";
import { User } from "models";
import { Session } from "next-session/lib/types";

export interface RichRequest extends Request {
	session: Session
	user: User
}
