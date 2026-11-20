<?php

declare(strict_types=1);

namespace Domain\Plans\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A task in one of the plan's phases started, finished, was blocked or was cancelled, so the plan's progress moved.
 * Raised only once that change has committed.
 */
final readonly class PlanProgressChanged implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(public string $planId) {}
}
