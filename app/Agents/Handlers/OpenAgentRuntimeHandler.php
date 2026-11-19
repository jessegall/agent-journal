<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\WorkStacks;
use App\Agents\Actions\AgentSessions;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Actions\RegisterPendingStart;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Exceptions\HostUnavailable;
use App\Agents\Exceptions\LaunchRootRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\Host;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\OpenedRuntime;
use App\Agents\Support\RuntimeIntent;
use App\Agents\Support\SelectedProgram;
use App\Contracts\CommandHandler;
use Illuminate\Support\Str;

final readonly class OpenAgentRuntimeHandler implements CommandHandler
{
    public function __construct(
        private WorkStacks $workStacks,
        private LaunchSessions $launches,
        private AgentSessions $sessions,
        private ActiveAccountReader $accounts,
        private RegisterPendingStart $starts,
    ) {}

    public function handle(OpenAgentRuntime $command): OpenedRuntime
    {
        $host = Host::query()->find($command->hostId);
        if ($host === null || $host->isRevoked()) {
            throw HostUnavailable::forHost($command->hostId);
        }

        if (! $host->permitsFolder($command->folder)) {
            throw LaunchRootRefused::outsideRoots($command->folder);
        }

        $parent = $this->parentSessionFor($command);
        $intent = new RuntimeIntent($host->id, $command->folder, $command->program, $command->programBuild, $command->profile, $command->driverType, $command->model, $command->effort, $command->firstMessage);

        $selection = SelectedProgram::resolve($command->program, ModelSelection::fromInput($command->model), null, null);

        $agent = Agent::query()->findOrFail($command->agentId);
        $this->sessions->lockForLaunch($agent);
        $account = $this->accounts->forLaunch($selection->program->value);
        $launched = $this->launches->launch($agent, $selection, (string) Str::ulid(), $parent, $intent);
        $this->starts->register($launched->session, $account);

        return $launched->opened();
    }

    /**
     * An actor working in a session opens only a child of it, on that session's host and inside its folder; an actor
     * that works in none opens a top-level runtime anywhere its host permits.
     *
     * @throws LaunchRootRefused
     */
    private function parentSessionFor(OpenAgentRuntime $command): AgentSession|null
    {
        $sessionId = $this->workStacks->sessionsToAdmit()[0] ?? null;

        if ($sessionId === null) {
            return null;
        }

        $parent = AgentSession::query()->findOrFail($sessionId);
        $parentRuntime = AgentRuntime::query()->where('agent_session_id', $parent->id)->first();

        if ($parentRuntime === null || $parentRuntime->host_id !== $command->hostId || ! str_starts_with($command->folder, rtrim($parentRuntime->canonical_folder, '/'))) {
            throw LaunchRootRefused::foreignToAgent();
        }

        return $parent;
    }
}
