<?php

declare(strict_types=1);

namespace App\Agents\Commands\StartAgent;

use App\Accounts\AccountSharingService;
use App\Accounts\Contracts\ActiveAccountReader;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Exceptions\StartPreviewStale;
use App\Agents\Resolvers\Support\PendingStartSecrets;
use App\Agents\Values\RuntimeIntent;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Sessions\StartAccepted;
use App\Exceptions\AgentBusy;
use App\Exceptions\HostUnavailable;
use App\Exceptions\StartRefusalReplayed;
use App\Exceptions\StartRefused;
use App\Exceptions\StartRequestConflict;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverSwitch;
use App\Models\Projects\Host;
use App\Models\Projects\Project;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionRequest;
use App\Sessions\AgentSessions;
use App\Sessions\AgentWakes;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\InitialWakeSettlement;
use App\Sessions\RegisterPendingStart;
use App\Sessions\StartedAgent;
use App\Sessions\StartReceipt;
use App\Sessions\StartSessions;
use App\Support\ContainerAdmission;
use App\Values\StackTarget;
use App\Values\StartRequest;

/**
 * Starts inside the command's transaction: the request's record first, locked, which KeepStartReceipt committed as
 * the intent, so a repeat finds its start or its refusal; then the session under the agent's shared lifecycle lock,
 * which a retirement waits for; the host is told after the commit and receives its token and settings through its
 * own read, never through the receipt.
 */
final readonly class StartAgentHandler implements CommandHandler
{
    public function __construct(
        private StartSessions $starts,
        private AgentSessions $sessions,
        private ActiveAccountReader $accounts,
        private RegisterPendingStart $pendingStarts,
        private PendingStartSecrets $pendingSecrets,
        private ContainerAdmission $containers,
        private CommandFacts $facts,
        private AgentWakes $wakes,
        private PinnedBuilds $builds,
        private DriverCatalogue $drivers,
        private AccountSharingService $accountSharing,
    ) {}

    /**
     * @throws StartPreviewStale
     * @throws StartRequestConflict
     * @throws StartRefusalReplayed
     * @throws StartRefused
     * @throws AgentBusy
     */
    public function handle(StartAgentCommand $command): StartReceipt
    {
        $request = $command->request;
        $dispatcher = $command->dispatchedBy();

        if ($request->previewRevision !== null && $request->previewRevision !== $this->drivers->revision()) {
            throw StartPreviewStale::since($request->previewRevision, $this->drivers->revision());
        }

        $pinned = $this->drivers->pinned(
            $request->selection->driver,
            $request->driverType,
            $request->neededCapabilities(),
        );

        $record = SessionRequest::create(
            $request,
            $pinned,
            $dispatcher,
        );

        // A replay of a start interrupted before its receipt resumes from the evidence its key holds: a session it
        // started, else a reservation the admission finds.
        if ($record->session_id !== null) {
            $session = AgentSession::query()->findOrFail($record->session_id);

            return $this->receiptOf($request, $session, false);
        }

        // Where the start runs, then the agent's lifecycle and start reservation, then the host's capacity, then the
        // driver's account, then the session: the order of every start.
        $agent = Agent::query()->findOrFail($request->agentId);
        $runtime = $this->hostRuntimeOf($request, $agent);
        $this->sessions->reserveStart($agent);

        if (DriverSwitch::findOpenOf($agent->id)?->stage->blocksWriter() === true) {
            throw AgentBusy::forAgent($agent->id);
        }

        if ($request->execution()->mode === ExecutionModeType::RequiredContainer) {
            $this->containers->admit($request->requestId, $request->selection->driver, $request->execution());
        }

        $account = $request->chosenAccount === null
            ? $this->accounts->forStart($request->selection->driver)
            : $this->accounts->chosenForStart(
                $request->selection->driver,
                $request->chosenAccount->accountId,
                $request->chosenAccount->reviewedSignIn,
            );

        $this->accountSharing->assertMayStart($pinned, $account);

        $parent = $request->parentSessionId === null
            ? null
            : AgentSession::query()->findOrFail($request->parentSessionId);

        $started = $this->starts->startInTransaction(
            $agent,
            $request->selection,
            $request->requestId,
            $parent,
            $runtime,
        );

        $started->session->keepDriverLabel($record->driver_label);
        $this->pendingStarts->register($started->session, $account);
        $this->wakeOnHost($started);
        SessionPolicy::create($started->session, $request->policy);
        $record->startedAs($started->session);
        $this->pendingSecrets->keep($request->requestId, $started);

        $this->facts->publishAfterCommit(new StartAccepted(
            $request->requestId,
            $request->agentId,
            $started->session->id,
            $parent?->agent_id,
        ));

        return $this->receiptOf($request, $started->session, true);
    }

    /**
     * A main start runs where its agent's project runs it: the local project's host that runs its driver build,
     * placement and driver type in that host's start folder, or a connected project's serving binding in its folder;
     * a start an owner runs through its own host's start socket opens no runtime here.
     *
     * @throws HostUnavailable
     * @throws StartRefused when no folder of the agent's connected project serves it now
     */
    private function hostRuntimeOf(StartRequest $request, Agent $agent): RuntimeIntent|null
    {
        if ($request->origin !== StartOriginType::MainStart) {
            return null;
        }

        $driver = $request->selection->driver;
        $build = $this->builds->versionOf($driver);

        $place = Host::findRunningStart(
            Project::findForId($agent->project_id),
            $driver,
            $request->execution()->mode,
            $request->driverType,
        );

        return new RuntimeIntent(
            $place->hostId,
            $place->folder,
            $driver,
            $build,
            $driver,
            $request->driverType,
            $request->selection->model,
            null,
            null,
            $request->savesDriverType,
        );
    }

    /**
     * The host learns of a runtime it was handed by claiming a request for it, so the new runtime gets a wake.
     */
    private function wakeOnHost(StartedAgent $started): void
    {
        if ($started->runtime === null) {
            return;
        }

        $this->wakes->wake(
            new StackTarget($started->session->agent_id, $started->session->id),
            InitialWakeSettlement::keyOf($started->session->id),
        );
    }

    private function receiptOf(StartRequest $request, AgentSession $session, bool $isNewSession): StartReceipt
    {
        $selection = $session->selection;

        return new StartReceipt(
            $request->requestId,
            $session->id,
            $session->agent_id,
            $selection,
            $isNewSession,
            $request->conversationMode,
            StartReceipt::ACTUAL_MODEL_NOT_REPORTED,
        );
    }
}
