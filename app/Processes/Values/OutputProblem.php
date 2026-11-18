<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\OutputStream;
use App\Processes\Enums\ProblemCode;

/**
 * Why a reader could not vouch for part of a check's output: the stable code, the stream and byte range, the reader
 * revision, a safe explanation and the next action.
 */
final readonly class OutputProblem
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
     * @param  array{code: string, stream: string|null, start: int, end: int, reader: string, explanation: string}  $fields
     */
    public static function fromArray(array $fields): self
    {
        $stream = $fields['stream'] === null ? null : OutputStream::from($fields['stream']);
        $code = ProblemCode::from($fields['code']);

        return new self($code, $stream, $fields['start'], $fields['end'], $fields['reader'], $fields['explanation']);
    }
}
