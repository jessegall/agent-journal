<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The work each source did in one search call, added up over its batches: the time, the rows examined, the bytes
 * read and how its last batch ended. It holds no words, titles or excerpts.
 */
final class SearchCallMeter
{
    /**
     * @var array<string, array{elapsed_us: int, rows: int, bytes: int, outcome: string}>
     */
    private array $sources = [];

    public function add(string $sourceKey, int $elapsedMicroseconds, WorkBudget $budget, string $outcome): void
    {
        $sofar = $this->sources[$sourceKey] ?? ['elapsed_us' => 0, 'rows' => 0, 'bytes' => 0, 'outcome' => $outcome];

        $this->sources[$sourceKey] = [
            'elapsed_us' => $sofar['elapsed_us'] + $elapsedMicroseconds,
            'rows' => $sofar['rows'] + $budget->spentCandidates(),
            'bytes' => $sofar['bytes'] + $budget->spentBytes(),
            'outcome' => $outcome,
        ];
    }

    /**
     * @return array<string, array{elapsed_us: int, rows: int, bytes: int, outcome: string}>
     */
    public function sources(): array
    {
        return $this->sources;
    }
}
