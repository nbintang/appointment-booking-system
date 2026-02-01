export class RedisKeyBuilder {
  private readonly segments: (string | number)[] = [];

  constructor(initialSegment: string | number) {
    this.segments.push(initialSegment);
  }

  add(segment: string | number): this {
    this.segments.push(segment);
    return this;
  }

  toString(): string {
    return this.segments.join(':');
  }
}
