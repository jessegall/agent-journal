<?php

declare(strict_types=1);

namespace App\Processes\Listeners;

use App\Contracts\Listener;
use App\Processes\Events\OutputChunkCommitted;
use App\Processes\Events\RunActivityChanged;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * A committed chunk changes its part's activity view: the pages that show the run are told to refresh it.
 */
final readonly class RefreshRunActivity implements Listener
{
    public function __construct(private Dispatcher $events) {}

    public function handle(OutputChunkCommitted $committed): void
    {
        $this->events->dispatch(new RunActivityChanged($committed->partRunId));
    }
}
