import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { EditQuestionUseCase } from "./edit-question";
import { NotAllowedError } from "./errors/not-allowed.error";

//SUT => System Under Test

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository
    );
  });

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("question-1")
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("2"),
      })
    );

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-1",
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentIds: ["1", "3"],
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "Pergunta teste",
      content: "Conteúdo teste",
    });

    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
    ]);
  });
  it("should not be able to edit a question from another author", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("question-1")
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-2",
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
