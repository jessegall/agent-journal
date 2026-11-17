<?php

declare(strict_types=1);

namespace App\Domain\Agents;

use App\Domain\Agents\Events\LaunchEnded;
use App\Domain\Agents\Events\LaunchSettingsRequested;
use App\Domain\Agents\Events\LaunchStarted;
use App\Domain\Agents\Models\Agent;
use App\Domain\Agents\Models\AgentSession;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Launches an agent: one journal session and one credential per launch, its isolated settings, and the launch event
 * that opens its stack, all in one launch transaction. A clear or resume inside the launch keeps the journal session.
 */
final readonly class LaunchSessions
{
    public function __construct(
        private LaunchTransaction $transaction,
        private AgentSessions $sessions,
        private LaunchCredentials $credentials,
        private Dispatcher $events,
    ) {}

    public function launch(Agent $agent, string $program, ?AgentSession $parent = null): LaunchedAgent
    {
        $settings = new IsolatedHookSettings;
        $this->events->dispatch(new LaunchSettingsRequested($program, $settings));

        if (! $settings->hasHooks()) {
            throw LaunchRefused::withoutHooks($program);
        }

        return $this->transaction->run(function () use ($agent, $program, $parent, $settings): LaunchedAgent {
            $session = $this->sessions->start($agent, $parent);
            $session->useProgram($program);
            $token = $this->credentials->issue($session);

            $this->events->dispatch(new LaunchStarted($agent->id, $session->id, $agent->role));

            return new LaunchedAgent($session, $token, $settings->content());
        });
    }

    /**
     * Records the program's own session id, which changes on a clear or a resume, without starting another journal session.
     */
    public function mapProgramSession(AgentSession $session, string $programSessionId): void
    {
        $session->mapProgramSession($programSessionId);
    }

    public function end(AgentSession $session): void
    {
        $this->transaction->run(function () use ($session): void {
            $this->sessions->end($session);
            $this->credentials->revoke($session);

            $this->events->dispatch(new LaunchEnded($session->agent_id, $session->id));
        });
    }
}
