<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * What a corpus case is frozen to read as: its outcome, the span of every command a complete line runs, and the
 * classification summary of a complete line.
 */
final class ShellCorpusExpectation extends Data
{
    /**
     * @param  list<ShellCorpusSpan>  $parts
     * @param  array<string, mixed>|Optional  $classification
     */
    public function __construct(
        public readonly string $outcome,
        #[DataCollectionOf(ShellCorpusSpan::class)]
        public readonly array $parts,
        public readonly array|Optional $classification = new Optional(),
    ) {}

    public function isComplete(): bool
    {
        return $this->outcome === 'complete';
    }

    /**
     * The spans in the order they start, as plain start and end pairs.
     *
     * @return list<array{start: int, end: int}>
     */
    public function sortedParts(): array
    {
        $parts = $this->parts;
        usort($parts, fn (ShellCorpusSpan $first, ShellCorpusSpan $second) => $first->compare($second));

        return array_map(fn (ShellCorpusSpan $span) => ['start' => $span->start, 'end' => $span->end], $parts);
    }
}
