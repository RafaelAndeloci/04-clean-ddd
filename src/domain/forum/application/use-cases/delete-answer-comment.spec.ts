import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed.error";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";

//SUT => System Under Test

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to delete a answer comment", async () => {
    const newAnswerComment = makeAnswerComment(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("answer-comment-1")
    );

    await inMemoryAnswerCommentsRepository.create(newAnswerComment);

    await sut.execute({
      answerCommentId: "answer-comment-1",
      authorId: "author-1",
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });
  it("should not be able to delete a answer comment from another author", async () => {
    const newAnswerComment = makeAnswerComment(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("answer-comment-1")
    );

    await inMemoryAnswerCommentsRepository.create(newAnswerComment);

    const result = await sut.execute({
      answerCommentId: "answer-comment-1",
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
