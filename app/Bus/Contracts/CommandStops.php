<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Processes\Contracts\StopTime;
use Closure;

/**
 * The stop times the commands of this operation run under, for work outside the bus that runs commands until a stop.
 */
interface CommandStops
{
    /**
     * Runs the work under the stop; the stops outside it hold again afterwards, whatever the work did.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function runUntil(StopTime $stop, Closure $work): mixed;
}
