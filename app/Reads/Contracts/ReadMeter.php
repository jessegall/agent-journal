<?php

declare(strict_types=1);

namespace App\Reads\Contracts;

use App\Reads\Values\Measurement;
use App\Reads\Values\ReadCounts;

/**
 * Counts the queries and models of the work it measures. A measurement inside another is counted in both; each event
 * is counted once per open measurement.
 */
interface ReadMeter
{
    /**
     * Runs the work and returns what it read with its value; a failure is counted and then thrown again.
     *
     * @template TValue
     *
     * @param  callable(): TValue  $work
     * @return Measurement<TValue>
     */
    public function measure(string $label, callable $work): Measurement;

    /**
     * What the innermost open measurement has read so far; empty counts when none is open.
     */
    public function current(): ReadCounts;
}
