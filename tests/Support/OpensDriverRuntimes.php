<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Enums\DriverType;
use App\Models\Agents\AgentSession;
use App\Support\AgentRuntimes;
use App\Values\RuntimeIntent;

/**
 * Opens a process driver's runtime for a started session, so the agent has a runtime that can be woken.
 */
trait OpensDriverRuntimes
{
    protected function openDriverRuntime(AgentSession $session): void
    {
        $intent = new RuntimeIntent(
            'host-1',
            base_path(),
            'claude-code',
            '1.0.0',
            'default',
            DriverType::Headless,
            null,
            null,
            null,
        );
        $this->app->make(AgentRuntimes::class)->open($session, $intent, 'start-token');
    }
}
