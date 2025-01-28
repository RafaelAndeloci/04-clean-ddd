import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { NotAllowedError } from "./errors/not-allowed.error";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";

export interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type EditAnswerUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { answer: Answer }
>;
export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}
  async execute({
    answerId,
    content,
    authorId,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    answer.content = content;

    await this.answersRepository.save(answer);

    return right({ answer });
  }
}
