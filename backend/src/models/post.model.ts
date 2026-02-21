import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPost extends Document {
  content: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Index for pagination (newest first)
postSchema.index({ createdAt: -1 });

export const Post = mongoose.model<IPost>("Post", postSchema);
