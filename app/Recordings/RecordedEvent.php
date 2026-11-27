<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Recordings\Enums\RecordedEventType;
use JsonSerializable;

/**
 * One event of a recorded exchange, at its moment in microseconds since the epoch: the bytes typed or printed, on
 * the stream they were printed on, or a terminal's new size. A secret typed keeps only that it was typed.
 */
final readonly class RecordedEvent implements JsonSerializable
{
    private function __construct(
        public RecordedEventType $type,
        public int $at,
        public string $bytes = '',
        public string $stream = '',
        public bool $isSecret = false,
        public int $columns = 0,
        public int $rows = 0,
    ) {}

    public static function typed(int $at, string $bytes): self
    {
        return new self(RecordedEventType::Typed, $at, $bytes);
    }

    public static function typedSecret(int $at): self
    {
        return new self(RecordedEventType::Typed, $at, isSecret: true);
    }

    public static function printed(int $at, string $stream, string $bytes): self
    {
        return new self(RecordedEventType::Printed, $at, $bytes, $stream);
    }

    public static function resized(int $at, int $columns, int $rows): self
    {
        return new self(RecordedEventType::Resized, $at, columns: $columns, rows: $rows);
    }

    /**
     * @param  array<string, mixed>  $line
     */
    public static function fromLine(array $line): self
    {
        return new self(
            RecordedEventType::from((string) $line['type']),
            (int) $line['at'],
            (string) base64_decode((string) $line['bytes'], true),
            (string) $line['stream'],
            (bool) $line['secret'],
            (int) $line['columns'],
            (int) $line['rows'],
        );
    }

    /**
     * Whether this printed on the same stream as the other, with nothing between them, so the two are one chunk.
     */
    public function continues(self $other): bool
    {
        return $this->type === RecordedEventType::Printed && $other->type === RecordedEventType::Printed
            && $this->stream === $other->stream;
    }

    /**
     * The other's bytes printed after this one's, at this one's time.
     */
    public function followedBy(self $other): self
    {
        return clone ($this, ['bytes' => $this->bytes.$other->bytes]);
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return [
            'type' => $this->type->value,
            'at' => $this->at,
            'bytes' => base64_encode($this->bytes),
            'stream' => $this->stream,
            'secret' => $this->isSecret,
            'columns' => $this->columns,
            'rows' => $this->rows,
        ];
    }
}
