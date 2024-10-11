import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  memberNumber: {
    type: Number,
    required: true,
  },
  interests: {
    type: [String],
    required: false,
  },
});

const Member = mongoose.models.Member || mongoose.model("Member", memberSchema);

export default Member;
