import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed.error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";

export interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>;

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}
  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(
      questionCommentId
    );

    if (!questionComment) return left(new ResourceNotFoundError());

    if (authorId !== questionComment.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionCommentsRepository.delete(questionComment);

    return right({});
  }
}
