export type ContributionRequestType = 'translation' | 'contribution';
export type ContributionRequestStatus = 'pending' | 'accepted' | 'rejected';

export type ContributionRequest = {
  id: string;
  userId: string;
  type: ContributionRequestType;
  novelTitle: string;
  description: string;
  status: ContributionRequestStatus;
  adminId?: string;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
};

export type ContributionMessage = {
  id: string;
  requestId: string;
  senderId: string;
  senderRole: 'reader' | 'admin';
  body: string;
  createdAt: Date;
};
