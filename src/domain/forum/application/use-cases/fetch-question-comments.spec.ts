import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";

//SUT => System Under Test

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question QuestionComments", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch question question comments", async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId("question-1") })
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId("question-1") })
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId("question-1") })
    );

    const result = await sut.execute({
      questionId: "question-1",
      page: 1,
    });
    expect(result.value?.questionComments).toHaveLength(3);
  });

  it("should be able to fetch paginated question question comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId("question-1") })
      );
    }

    const result = await sut.execute({
      questionId: "question-1",
      page: 2,
    });
    expect(result.value?.questionComments).toHaveLength(2);
  });
});
