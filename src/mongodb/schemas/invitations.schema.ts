import { Document, model, Schema } from 'mongoose';

interface IInvitation extends Document {
  guildId: string;
  userId: string;
  numberInvitation: number;
}

const InvitationsSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  numberInvitation: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default model<IInvitation>('Invitation', InvitationsSchema);
