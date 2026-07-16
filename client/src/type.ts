export interface Note {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface NewNote {
  title: string;
  body: string;
}
