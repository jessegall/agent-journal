<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * An agent of the test as a test asserts it: its newest session and the runtime of that session, read when asked.
 */
final readonly class AgentFacts implements Facts
{
    public function __construct(private Agent $agent) {}

    public function facts(): array
    {
        return [
            'name' => $this->agent->name,
            'session' => fn () => $this->newestSession() === null ? null : new SessionFacts($this->newestSession()->id),
            'runtime' => function () {
                $session = $this->newestSession();
                $runtime = $session === null ? null : AgentRuntime::findForSession($session->id);

                return $runtime === null ? null : new RuntimeFacts($runtime);
            },
        ];
    }

    private function newestSession(): AgentSession|null
    {
        return AgentSession::query()
            ->withoutGlobalScopes()
            ->where('agent_id', $this->agent->id)
            ->latest('id')
            ->first();
    }
}
