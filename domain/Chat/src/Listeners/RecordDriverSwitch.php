<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Sessions\DriverSwitchConfirmed;
use App\Models\Drivers\DriverSwitch;
use Domain\Chat\Support\DriverSwitchLines;

/**
 * Once a switch's replacing session runs, its chat line says what the agent switched from and to.
 */
final readonly class RecordDriverSwitch implements Listener
{
    public function __construct(private DriverSwitchLines $lines) {}

    public function handle(DriverSwitchConfirmed $event): void
    {
        $this->lines->switched(DriverSwitch::query()->findOrFail($event->switchId));
    }
}
