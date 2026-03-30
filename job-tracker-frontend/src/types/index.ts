export type ApplicationStatus =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Ghosted"
  | "In Review";

export interface AuthLoginResponse {
  message: string;
  data: {
    message: string;
  };
}

export interface MfaVerifyResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    mustChangePassword: boolean;
  };
}

export interface ApplicationItem {
  id: string;
  company: string;
  jobTitle: string;
  platform: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt?: string;
  lastStatusChangedAt?: string;
  notes?: { id: string; content: string; createdAt: string }[];
}

export interface UserPreferences {
  autoDeleteEnabled: boolean;
  autoDeleteDays: 15 | 30 | 60;
}
