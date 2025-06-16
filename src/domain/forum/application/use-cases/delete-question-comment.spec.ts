import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { NotAllowedError } from "../../../../core/errors/not-allowed.error";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";

//SUT => System Under Test

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to delete a question comment", async () => {
    const newQuestionComment = makeQuestionComment(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("question-comment-1")
    );

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    await sut.execute({
      questionCommentId: "question-comment-1",
      authorId: "author-1",
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });
  it("should not be able to delete a question comment from another author", async () => {
    const newQuestionComment = makeQuestionComment(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("question-comment-1")
    );

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    const result = await sut.execute({
      questionCommentId: "question-comment-1",
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
