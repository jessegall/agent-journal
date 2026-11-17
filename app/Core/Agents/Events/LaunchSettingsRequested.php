<?php

declare(strict_types=1);

namespace App\Core\Agents\Events;

use App\Core\Agents\Support\IsolatedHookSettings;

/**
 * A program is about to be launched: listeners add the hooks and tool rules its isolated settings need.
 */
final readonly class LaunchSettingsRequested
{
    public function __construct(
        public string $program,
        public IsolatedHookSettings $settings,
    ) {}
}
