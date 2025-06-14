import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id);
    return answerComment ?? null;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id
    );
    this.items.splice(itemIndex, 1);
  }
  public items: AnswerComment[] = [];

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment);
  }
}
