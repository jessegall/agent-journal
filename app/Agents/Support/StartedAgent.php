<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Exceptions\StartRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverRequest;

/**
 * What the host needs to run one started program: its journal session, its token, handed out once, and its isolated
 * settings.
 */
final readonly class StartedAgent
{
    /**
     * @param  list<string>  $programArguments  the arguments the host starts the program with, such as its model
     */
    public function __construct(
        public AgentSession $session,
        public string $token,
        public string $settings,
        public array $programArguments,
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
    public function material(): StartMaterial
    {
        return new StartMaterial($this->session->id, $this->token, $this->settings);
    }
}
