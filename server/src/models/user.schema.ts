import mongoose from "mongoose"
import { validate } from "../utils/emailValidator";

export interface IUser extends Document {
  email: string,
  oobId: string,
  sentCredential: boolean,
  issuedCredential: boolean,
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate
  },
  oobId: {
    type: String,
    unique: true,
  },
  sentCredential: {
    type: Boolean,
    default: false
  },
  issuedCredential: {
    type: Boolean,
    default: false
  }
});

userSchema.index({email: 1, oobId: 1});

export const User = mongoose.model<IUser>("User", userSchema);