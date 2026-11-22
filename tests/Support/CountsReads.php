<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\ReadMeter;
use App\Values\ReadCounts;

/**
 * Reads the queries and models a call ran and loaded.
 */
trait CountsReads
{
    /**
     * @param  callable(): mixed  $call
     */
    protected function readCounts(callable $call): ReadCounts
    {
        return $this->app->make(ReadMeter::class)->measure('test', $call)->counts;
    }
}
