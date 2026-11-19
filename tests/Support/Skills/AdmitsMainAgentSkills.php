<?php

declare(strict_types=1);

namespace Tests\Support\Skills;

use App\Agents\Enums\SessionStatus;
use App\Agents\Events\LaunchStarted;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Skills\Listeners\AdmitLaunchSkills;
use Tests\Fixtures\Agents\TestSelections;

/**
 * An active main agent session whose launch has admitted its skills, as the launch listener does.
 */
trait AdmitsMainAgentSkills
{
    private function launchedMainAgent(): AgentSession
    {
        $agent = Agent::named('Main', 'main-agent');
        $session = new AgentSession(TestSelections::sessionColumns());
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();
        $this->app->make(AdmitLaunchSkills::class)->handle(new LaunchStarted($agent->id, $session->id));

        return $session;
    }
}
