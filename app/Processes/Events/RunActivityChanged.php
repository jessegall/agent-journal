<?php

declare(strict_types=1);

namespace App\Processes\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;

/**
 * A part of a run wrote more output, so its activity view changed; pages showing the run refresh.
 */
final readonly class RunActivityChanged implements Event, UpdatesUserInterface
{
    public function __construct(public string $partRunId) {}
}
