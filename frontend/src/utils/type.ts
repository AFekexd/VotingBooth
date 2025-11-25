interface Option {
  id: number;
  voteId: number;
  optionText: string;
  voteCount: number;
  createdAt: string;
}

interface Vote{
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  options?: Option[];
}

export type { Vote, Option };
