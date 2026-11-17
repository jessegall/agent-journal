<?php

declare(strict_types=1);

namespace App\Core\Agents\Support;

use App\Core\Agents\Models\AgentSession;

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
