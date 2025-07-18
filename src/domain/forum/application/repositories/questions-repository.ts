import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question";

export interface QuestionsRepository {
  findManyRecent(params: PaginationParams): Promise<Question[]>;
  findById(id: string): Promise<Question | null>;
  create(question: Question): Promise<void>;
  save(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
  findBySlug(slug: string): Promise<Question | null>;
}
