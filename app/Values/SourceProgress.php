<?php

declare(strict_types=1);

namespace App\Values;

/**
 * Where one source of a search stands: the position to ask it from next, whether its range is exhausted, the
 * certified hits it returned that are not shown yet, and how many calls in a row it timed out or stood still.
 */
final class SourceProgress
{
    /**
     * @param  list<BufferedHit>  $buffer
     */
    public function __construct(
        public readonly string $sourceKey,
        public SourcePosition|null $position = null,
        public bool $exhausted = false,
        public array $buffer = [],
        public int $stalls = 0,
    ) {}

    /**
     * Whether the source must be asked again before the search may emit past it.
     */
    public function needsRefill(): bool
    {
        return ! $this->exhausted && $this->buffer === [];
    }

    public function isDone(): bool
    {
        return $this->exhausted && $this->buffer === [];
    }

    public function head(): BufferedHit|null
    {
        return $this->buffer[0] ?? null;
    }

    public function dropHead(): void
    {
        array_shift($this->buffer);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'source' => $this->sourceKey,
            'position' => $this->position?->fields,
            'exhausted' => $this->exhausted,
            'buffer' => array_map(fn (BufferedHit $hit) => $hit->toArray(), $this->buffer),
            'stalls' => $this->stalls,
        ];
    }

    /**
     * @param  array{
     *     source: string,
     *     position: array<string, int|string>|null,
     *     exhausted: bool,
     *     buffer: list<array{source: string, type: string, id: string, location: string|null, score: int}>,
     *     stalls: int,
     * }  $fields
     */
    public static function fromArray(array $fields): self
    {
        return new self(
            $fields['source'],
            $fields['position'] === null ? null : SourcePosition::of($fields['position']),
            $fields['exhausted'],
            array_map(BufferedHit::fromArray(...), $fields['buffer']),
            $fields['stalls'],
        );
    }
}
