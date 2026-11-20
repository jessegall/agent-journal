<?php

declare(strict_types=1);

namespace Tests\Support\Skills;

use App\Agents\Enums\SessionStatus;
use App\Agents\Events\SessionOpened;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Skills\Listeners\AdmitStartSkills;
use Tests\Fixtures\Agents\TestSelections;

/**
 * An active main agent session whose start has admitted its skills, as the start listener does.
 */
trait AdmitsMainAgentSkills
{
    private function startedMainAgent(): AgentSession
    {
        $agent = Agent::create('Main', 'main-agent');
        $session = new AgentSession(TestSelections::sessionColumns());
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();
        $this->app->make(AdmitStartSkills::class)->handle(new SessionOpened($agent->id, $session->id));

        return $session;
    }
}
