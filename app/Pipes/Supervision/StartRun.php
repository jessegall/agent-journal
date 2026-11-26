<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Support\Execution\ActiveRun;
use App\Support\Execution\PlannedRun;

/**
 * Opens the run's state: where its events go, the stop signal, its attempts and its background parts.
 */
final readonly class StartRun implements Pipe
{
    public function handle(PlannedRun $run): ActiveRun
    {
        return $run->start();
    }
}
