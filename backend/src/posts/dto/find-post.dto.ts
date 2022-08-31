export class FindPostResponseDto {
  constructor(
    id: number,
    title: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
