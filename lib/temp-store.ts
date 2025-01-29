import type { User } from "@/types";

interface TempStore {
  users: User[];
}

export const tempStore: TempStore = {
  users: [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "ADMIN",
      lawyerCode: "ADM123",
      createdAt: new Date(),
    },
  ],
};
