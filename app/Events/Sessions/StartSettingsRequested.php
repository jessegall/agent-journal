<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Asks\AnsweredAtOnce;
use App\Support\IsolatedHookSettings;

/**
 * A driver is about to be started: listeners add the hooks and tool rules its isolated settings need.
 */
final readonly class StartSettingsRequested extends SessionEvent implements AnsweredAtOnce
{
    public function __construct(
        public string $driver,
        public IsolatedHookSettings $settings,
    ) {}
}
