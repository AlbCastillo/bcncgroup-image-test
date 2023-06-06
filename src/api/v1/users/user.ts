import mongoose, { Document, Schema } from 'mongoose';

/**
 * MONGOOSE USER INTERFACE
 */
export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  admin: boolean;
}

/**
 * MONGOOSE USER SCHEMA
 */
export const UserSchema: Schema<IUser> = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    admin: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * MOONGOSE USER MODEL
 */
export default mongoose.model<IUser>('User', UserSchema);
