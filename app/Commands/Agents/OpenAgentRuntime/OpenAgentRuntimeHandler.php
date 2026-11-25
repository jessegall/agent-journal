<?php

declare(strict_types=1);

namespace App\Commands\Agents\OpenAgentRuntime;

use App\Contracts\Accounts\ActiveAccountReader;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\BuiltInStartProfiles;
use App\Contracts\Sessions\ProfileSelections;
use App\Contracts\Work\ActorStackSessions;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverCapability;
use App\Exceptions\HostUnavailable;
use App\Exceptions\StartRootRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Projects\Host;
use App\Models\Starts\SessionPolicy;
use App\Support\AccountSharingService;
use App\Support\AgentSessions;
use App\Support\ArrangementSetting;
use App\Support\ContainerAdmission;
use App\Support\OpenedRuntime;
use App\Support\RegisterPendingStart;
use App\Support\StartSessions;
use App\Values\ModelSelection;
use App\Values\ProfileKey;
use App\Values\RuntimeIntent;
use Illuminate\Support\Str;

final readonly class OpenAgentRuntimeHandler implements CommandHandler
{
    public function __construct(
        private ActorStackSessions $stackSessions,
        private StartSessions $starts,
        private AgentSessions $sessions,
        private ActiveAccountReader $accounts,
        private RegisterPendingStart $pendingStarts,
        private ArrangementSetting $arrangement,
        private BuiltInStartProfiles $builtInProfiles,
        private ContainerAdmission $containers,
        private DriverCatalogue $drivers,
        private ProfileSelections $profiles,
        private AccountSharingService $accountSharing,
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
            $command->driverType,
            $command->model,
            $command->effort,
            $command->firstMessage,
            $command->shouldSaveDriverType,
        );

        $agent = Agent::query()->findOrFail($command->agentId);
        // The built-in profiles are installed by the first read of one, so the agent's profile exists from here on.
        $policy = $this->builtInProfiles->policyFor($agent->profile_key);

        // The agent's profile supplies the model when the start names none.
        $selection = $this->profiles->select(
            ProfileKey::from($agent->profile_key),
            ModelSelection::fromInput($command->model),
            $command->driver,
            null,
        )->selection;

        $pinned = $this->drivers->pinned($command->driver, $command->driverType);
        $this->arrangement->assertContainable($pinned->support->supportOf(DriverCapability::RunContained));

        $this->sessions->lockForStart($agent);
        $requestId = (string) Str::ulid();
        // A connected folder's relay runs its agents on the user's own machine, never in this journal's containers.
        $mode = $policy->execution->mode;

        if ($mode === ExecutionModeType::RequiredContainer && $host->runsPlacement($mode)) {
            $this->containers->admit($requestId, $selection->driver, $policy->execution);
        }

        $account = $this->accounts->forStart($selection->driver);
        $this->accountSharing->assertMayStart($pinned, $account);

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
        $sessionId = $this->stackSessions->admittableSessions()[0] ?? null;

        if ($sessionId === null) {
            return null;
        }

        $parent = AgentSession::query()->findOrFail($sessionId);
        $parentRuntime = AgentRuntime::query()->ofAgentSession($parent->id)->first();

        if ($parentRuntime === null
            || $parentRuntime->host_id !== $command->hostId
            || ! str_starts_with($command->folder, rtrim($parentRuntime->canonical_folder, '/'))) {
            throw StartRootRefused::foreignToAgent();
        }

        return $parent;
    }
}
