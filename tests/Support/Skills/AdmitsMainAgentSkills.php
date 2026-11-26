<?php

declare(strict_types=1);

namespace Tests\Support\Skills;

use App\Events\Sessions\SessionOpened;
use App\Listeners\AdmitStartSkills;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Sessions\Enums\SessionStatus;
use Tests\Fixtures\Agents\TestSelections;

/**
 * An active main agent session whose start has admitted its skills, as the start listener does.
 */
trait AdmitsMainAgentSkills
{
    private function startedMainAgent(): AgentSession
    {
        $agent = $this->journal->idleAgent('Main')->agentCalled('Main');
        $session = new AgentSession()->forceFill(TestSelections::sessionColumns());
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();
        $this->app->make(AdmitStartSkills::class)->handle(new SessionOpened($agent->id, $session->id));

        return $session;
    }
}
