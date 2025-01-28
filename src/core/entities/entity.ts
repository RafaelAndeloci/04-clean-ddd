import { UniqueEntityId } from "./unique-entity-id";

export abstract class Entity<TProps> {
  private _id: UniqueEntityId;
  protected props: TProps;

  public get id() {
    return this._id;
  }

  protected constructor(props: TProps, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }
}
