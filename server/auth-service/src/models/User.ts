import mongoose, { Schema, Document } from 'mongoose';

// Define the role types
export type UserRole = 'customer' | 'restaurant' | 'deliveryAgent';

// Define the interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isAdmin: boolean;
  isVerified: boolean;
  otp: string | null;
  otpExpires: Date | null;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  currentLocation?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  isAvailable?: boolean; // For delivery agents to mark themselves as available
  profilePicture?: string; // Add this line to explicitly define profilePicture
}

// Define the schema for the User model
const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['customer', 'restaurant', 'deliveryAgent'], 
      required: true 
    },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Number, default: null },
    currentLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    isAvailable: { type: Boolean, default: false },
    profilePicture: { type: String }
  },
  { timestamps: true }
);

// Add geospatial index for location queries
userSchema.index({ currentLocation: '2dsphere' });

// Create the User model and export it
const User = mongoose.model<IUser>('User', userSchema);
export default User;