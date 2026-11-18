<?php

declare(strict_types=1);

namespace App\Reads\Support;

use App\Reads\Contracts\ReadMeter;
use App\Reads\Exceptions\QueryInValueRead;
use App\Reads\Values\Measurement;
use App\Reads\Values\ReadCounts;
use Illuminate\Container\Container;

/**
 * The read meter of one request, job or command: a stack of open measurements, each counting every event that
 * happens while it is open. It lives for one scope, so two requests of one worker never share counts.
 */
final class ScopedReadMeter implements ReadMeter
{
    /**
     * @var list<ReadTally>
     */
    private array $open = [];

    /**
     * The boundaries that may run no query, innermost last.
     *
     * @var list<string>
     */
    private array $queryFreeBoundaries = [];

    /**
     * The meter of the request, job or command running now, for the database and model hooks that cannot take it
     * injected.
     */
    public static function ofCurrentScope(): self
    {
        return Container::getInstance()->make(self::class);
    }

    public function measure(string $label, callable $work): Measurement
    {
        $tally = new ReadTally;
        $this->open[] = $tally;

        try {
            $value = $work();
        } finally {
            array_pop($this->open);
        }

        return new Measurement($label, $tally->counts(), $value);
    }

    /**
     * Opens a measurement that an event closes later, for an entry that is not one call: an artisan command or a job.
     */
    public function begin(): void
    {
        $this->open[] = new ReadTally;
    }

    /**
     * Closes the measurement begin() opened last and returns what it read.
     */
    public function end(): ReadCounts
    {
        return (array_pop($this->open) ?? new ReadTally)->counts();
    }

    public function current(): ReadCounts
    {
        $innermost = $this->open === [] ? new ReadTally : $this->open[array_key_last($this->open)];

        return $innermost->counts();
    }

    /**
     * Runs the work with every query refused, naming the boundary in the refusal.
     *
     * @template TValue
     *
     * @param  callable(): TValue  $work
     * @return TValue
     */
    public function withoutQueries(string $boundary, callable $work): mixed
    {
        $this->queryFreeBoundaries[] = $boundary;

        try {
            return $work();
        } finally {
            array_pop($this->queryFreeBoundaries);
        }
    }

    /**
     * @throws QueryInValueRead when a query-free boundary is open
     */
    public function recordQuery(string $connection, bool $writes): void
    {
        $boundary = end($this->queryFreeBoundaries);

        if ($boundary !== false) {
            $this->recordRefusedQuery();

            throw QueryInValueRead::during($boundary);
        }

        foreach ($this->open as $tally) {
            $tally->addQuery($connection, $writes);
        }
    }

    public function recordRefusedQuery(): void
    {
        foreach ($this->open as $tally) {
            $tally->addRefusedQuery();
        }
    }

    public function recordCompletedQuery(): void
    {
        foreach ($this->open as $tally) {
            $tally->addCompletedQuery();
        }
    }

    /**
     * @param  class-string  $model
     */
    public function recordModel(string $model): void
    {
        foreach ($this->open as $tally) {
            $tally->addModel($model);
        }
    }
}
