import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-choosen-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString()
    );

    if (!answer)
      throw new Error(
        "Cannot send notification for best answer chosen because the answer does not exist"
      );

    await this.sendNotification.execute({
      recipientId: answer.authorId.toString(),
      title: "Sua resposta foi escolhida como a melhor!",
      content: `A resposta que você enviou em "${question.title
        .substring(0, 20)
        .concat("...")}" foi escolhida como a melhor pelo autor!`,
    });
  }
}
