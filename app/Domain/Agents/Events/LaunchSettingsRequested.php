<?php

declare(strict_types=1);

namespace App\Domain\Agents\Events;

use App\Domain\Agents\IsolatedHookSettings;

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
