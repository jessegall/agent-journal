<?php

declare(strict_types=1);

namespace App\Commands\OpenAgentRuntime;

use App\Contracts\ActiveAccountReader;
use App\Contracts\BuiltInStartProfiles;
use App\Contracts\CommandHandler;
use App\Contracts\DriverCatalogue;
use App\Contracts\WorkStacks;
use App\Enums\DriverCapability;
use App\Enums\ExecutionModeType;
use App\Exceptions\HostUnavailable;
use App\Exceptions\StartRootRefused;
use App\Models\Agent;
use App\Models\AgentRuntime;
use App\Models\AgentSession;
use App\Models\Host;
use App\Models\SessionPolicy;
use App\Support\AgentSessions;
use App\Support\ArrangementSetting;
use App\Support\ContainerAdmission;
use App\Support\OpenedRuntime;
use App\Support\RegisterPendingStart;
use App\Support\StartSessions;
use App\Values\ModelSelection;
use App\Values\RuntimeIntent;
use App\Values\SelectedDriver;
use Illuminate\Support\Str;

final readonly class OpenAgentRuntimeHandler implements CommandHandler
{
    public function __construct(
        private WorkStacks $workStacks,
        private StartSessions $starts,
        private AgentSessions $sessions,
        private ActiveAccountReader $accounts,
        private RegisterPendingStart $pendingStarts,
        private ArrangementSetting $arrangement,
        private BuiltInStartProfiles $builtInProfiles,
        private ContainerAdmission $containers,
        private DriverCatalogue $drivers,
    ) {}

    public function handle(OpenAgentRuntimeCommand $command): OpenedRuntime
    {
        $host = Host::query()->find($command->hostId);

        if ($host === null || $host->isRevoked()) {
            throw HostUnavailable::forHost($command->hostId);
        }

        if (! $host->permitsFolder($command->folder)) {
            throw StartRootRefused::outsideRoots($command->folder);
        }

        $this->arrangement->assertFits($host);

        $parent = $this->parentSessionFor($command);

        $intent = new RuntimeIntent(
            $host->id,
            $command->folder,
            $command->driver,
            $command->driverBuild,
            $command->profile,
            $command->variant,
            $command->model,
            $command->effort,
            $command->firstMessage,
            $command->saveVariant,
        );

        $selection = SelectedDriver::resolve(
            $command->driver,
            ModelSelection::fromInput($command->model),
            null,
            null,
            $this->drivers,
        );

        $this->arrangement->assertContainable(
            $this->drivers->pinned($command->driver, $command->variant)->support->supportOf(DriverCapability::RunContained),
        );

        $agent = Agent::query()->findOrFail($command->agentId);
        $this->sessions->lockForStart($agent);
        $requestId = (string) Str::ulid();
        $policy = $this->builtInProfiles->policyFor($agent->profile_key);

        // A connected folder's relay runs its agents on the user's own machine, never in this journal's containers.
        if ($policy->execution->mode === ExecutionModeType::RequiredContainer && $host->runsPlacement($policy->execution->mode)) {
            $this->containers->admit($requestId, $selection->driver, $policy->execution);
        }

        $account = $this->accounts->forStart($selection->driver);

        $started = $this->starts->start(
            $agent,
            $selection,
            $requestId,
            $parent,
            $intent,
        );

        $this->pendingStarts->register($started->session, $account);
        SessionPolicy::create($started->session, $policy);

        return $started->opened();
    }

    /**
     * An actor working in a session opens only a child of it, on that session's host and inside its folder; an actor
     * that works in none opens a top-level runtime anywhere its host permits.
     *
     * @throws StartRootRefused
     */
    private function parentSessionFor(OpenAgentRuntimeCommand $command): AgentSession|null
    {
        $sessionId = $this->workStacks->sessionsToAdmit()[0] ?? null;

        if ($sessionId === null) {
            return null;
        }

        $parent = AgentSession::query()->findOrFail($sessionId);
        $parentRuntime = AgentRuntime::query()->where('agent_session_id', $parent->id)->first();

        if ($parentRuntime === null
            || $parentRuntime->host_id !== $command->hostId
            || ! str_starts_with($command->folder, rtrim($parentRuntime->canonical_folder, '/'))) {
            throw StartRootRefused::foreignToAgent();
        }

        return $parent;
    }
}
