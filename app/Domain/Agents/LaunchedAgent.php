<?php

declare(strict_types=1);

namespace App\Domain\Agents;

use App\Domain\Agents\Models\AgentSession;

/**
 * What the host needs to start one launched program: its journal session, its token, handed out once, and its isolated settings.
 */
final readonly class LaunchedAgent
{
    public function __construct(
        public AgentSession $session,
        public string $token,
        public string $settings,
    ) {}
}
