<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Exceptions\StartRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;

/**
 * What the host needs to run one started driver: its journal session, its token, handed out once, and its isolated
 * settings.
 */
final readonly class StartedAgent
{
    public function __construct(
        public AgentSession $session,
        public string $token,
        public string $settings,
        public AgentRuntime|null $runtime,
        public DriverRequest|null $firstRequest,
    ) {}

    /**
     * The opened runtime as callers see it; a start made without a runtime intent has none.
     *
     * @throws StartRefused
     */
    public function opened(): OpenedRuntime
    {
        $runtime = $this->runtime ?? throw StartRefused::withoutRuntime($this->session->id);

        return new OpenedRuntime($this->session->id, $runtime->id, $this->firstRequest?->id);
    }

    /**
     * What the host needs for this start: the session, its token and its isolated settings.
     */
    public function secrets(): StartSecrets
    {
        return new StartSecrets($this->session->id, $this->token, $this->settings);
    }
}
