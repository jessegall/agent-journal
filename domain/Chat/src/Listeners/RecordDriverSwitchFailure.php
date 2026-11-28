<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Sessions\DriverSwitchStartFailed;
use App\Models\Drivers\DriverSwitch;
use Domain\Chat\Support\DriverSwitchLines;

/**
 * A switch whose new session failed to start leaves one chat line with the reason; the agent stays on its old driver.
 */
final readonly class RecordDriverSwitchFailure implements Listener
{
    public function __construct(private DriverSwitchLines $lines) {}

    public function handle(DriverSwitchStartFailed $event): void
    {
        $switch = DriverSwitch::query()->findOrFail($event->switchId);
        $this->lines->failed($switch, $event->reason);
    }
}
