<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Agents\Support\IsolatedHookSettings;
use App\Contracts\Event;

/**
 * A program is about to be started: listeners add the hooks and tool rules its isolated settings need.
 */
final readonly class StartSettingsRequested implements Event
{
    public function __construct(
        public string $driver,
        public IsolatedHookSettings $settings,
    ) {}
}
