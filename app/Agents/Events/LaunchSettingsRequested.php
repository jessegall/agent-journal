<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Agents\Support\IsolatedHookSettings;
use App\Contracts\Event;

/**
 * A program is about to be launched: listeners add the hooks and tool rules its isolated settings need.
 */
final readonly class LaunchSettingsRequested implements Event
{
    public function __construct(
        public string $program,
        public IsolatedHookSettings $settings,
    ) {}
}
