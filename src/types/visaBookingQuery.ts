export interface VisaBookingQuery {
  _id: string;
  country: string;
  visaType: string;
  type: "query" | "application";
  name: string;
  email: string;
  phone: string;
  status: "pending" | "contacted" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface VisaBookingQueryStats {
  total: number;
  pending: number;
  contacted: number;
  closed: number;
}

export interface CreateVisaBookingQueryInput {
  country: string;
  visaType: string;
  type?: "query" | "application";
  name: string;
  email?: string | undefined;
  phone: string;
}

export interface UpdateVisaBookingQueryStatusInput {
  status: "pending" | "contacted" | "closed";
}
