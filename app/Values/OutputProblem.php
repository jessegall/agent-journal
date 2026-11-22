<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Settings\StoredValue;
use App\Enums\OutputStream;
use App\Enums\ProblemCode;
use App\Support\Stored\StoredOutputProblem;

/**
 * Why a reader could not vouch for part of a check's output: the stable code, the stream and byte range, the reader
 * revision, a safe explanation and the next action.
 */
final readonly class OutputProblem implements StoredValue
{
    public function __construct(
        public ProblemCode $code,
        public OutputStream|null $stream,
        public int $start,
        public int $end,
        public string $readerRevision,
        public string $explanation,
    ) {}

    /**
     * A problem about the output as a whole rather than a byte range of one stream.
     */
    public static function ofWholeOutput(ProblemCode $code, string $readerRevision, string $explanation): self
    {
        return new self($code, null, 0, 0, $readerRevision, $explanation);
    }

    public function nextAction(): string
    {
        return $this->code->nextAction();
    }

    /**
     * @return array{code: string, stream: string|null, start: int, end: int, reader: string, explanation: string}
     */
    public function toArray(): array
    {
        return [
            'code' => $this->code->value,
            'stream' => $this->stream?->value,
            'start' => $this->start,
            'end' => $this->end,
            'reader' => $this->readerRevision,
            'explanation' => $this->explanation,
        ];
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): self
    {
        return StoredOutputProblem::from($fields)->problem();
    }

    public static function fromJson(string $json): self
    {
        return StoredOutputProblem::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR))->problem();
    }

    public static function listFromJson(string $json): array
    {
        return array_values(array_map(
            fn (StoredOutputProblem $stored) => $stored->problem(),
            StoredOutputProblem::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)),
        ));
    }
}
