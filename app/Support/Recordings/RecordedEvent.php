<?php

declare(strict_types=1);

namespace App\Support\Recordings;

use App\Support\Recordings\Enums\RecordedEventType;
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
        public RecordedCall|null $call = null,
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

    public static function asked(int $at, RecordedCall $call): self
    {
        return new self(RecordedEventType::Asked, $at, call: $call);
    }

    public static function answered(int $at, RecordedCall $call): self
    {
        return new self(RecordedEventType::Answered, $at, call: $call);
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
            is_array($line['call'] ?? null) ? RecordedCall::fromLine($line['call']) : null,
        );
    }

    /**
     * The event with every real value it carries faked: what was typed or printed, and its call.
     */
    public function fakedBy(RecordingFakes $fakes): self
    {
        return clone ($this, ['bytes' => $fakes->replaceIn($this->bytes), 'call' => $this->call?->fakedBy($fakes)]);
    }

    public function withCall(RecordedCall $call): self
    {
        return clone ($this, ['call' => $call]);
    }

    /**
     * The host's output report this event asked with, none for any other event.
     */
    public function outputReport(): RecordedOutputReport|null
    {
        if ($this->call === null) {
            return null;
        }

        return RecordedOutputReport::askedBy($this->call);
    }

    /**
     * The event asking with the report in place of the one it asked with.
     */
    public function withOutputReport(RecordedOutputReport $report): self
    {
        if ($this->call === null) {
            return $this;
        }

        return $this->withCall($this->call->withBody($report->body()));
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
            'call' => $this->call,
        ];
    }
}
