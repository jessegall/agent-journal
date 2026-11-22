<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Events\Event;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\Sources\Contracts\DockSourceChanged;
use Domain\Plans\Models\Plan;

/**
 * A task in one of the plan's phases started, finished, was blocked or was cancelled, so the plan's progress moved.
 * Raised only once that change has committed.
 */
final readonly class PlanProgressChanged implements
    DockSourceChanged,
    Event,
    UserInterfaceUpdater
{
    public function __construct(public string $planId) {}

    public function dockType(): string
    {
        return Plan::LINK_TYPE;
    }

    public function dockId(): string
    {
        return $this->planId;
    }
}
