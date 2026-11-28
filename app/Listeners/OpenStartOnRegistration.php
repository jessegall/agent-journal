<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Bus\Attributes\RetriedWhenItFails;
use App\Contracts\Events\Listener;
use App\Events\Sessions\SessionProcessRegistered;
use App\Models\Agents\AgentRuntime;

/**
 * A registered start is opened as its runtime's driver decides, once the start committed: the journal opens what it
 * runs itself, and a host-run driver's start waits for its host's claim.
 */
#[RetriedWhenItFails]
final readonly class OpenStartOnRegistration implements Listener
{
    public function __construct(private DriverCatalogue $drivers) {}

    public function handle(SessionProcessRegistered $fact): void
    {
        $runtime = AgentRuntime::findForSession($fact->sessionId);

        if ($runtime === null) {
            return;
        }

        $this->drivers->forRuntime($runtime)->openStart($runtime);
    }
}
