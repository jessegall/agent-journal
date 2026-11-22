<?php

declare(strict_types=1);

namespace App\Commands\StartAgent;

use App\Contracts\ActiveAccountReader;
use App\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Contracts\DriverCatalogue;
use App\Contracts\PinnedBuilds;
use App\Contracts\ReplyInboxes;
use App\Enums\ExecutionModeType;
use App\Enums\StartOriginType;
use App\Events\StartAccepted;
use App\Exceptions\AgentBusy;
use App\Exceptions\HostUnavailable;
use App\Exceptions\StartPreviewStale;
use App\Exceptions\StartRefusalReplayed;
use App\Exceptions\StartRefused;
use App\Exceptions\StartRequestConflict;
use App\Models\Agent;
use App\Models\AgentSession;
use App\Models\DriverSwitch;
use App\Models\Host;
use App\Models\SessionPolicy;
use App\Models\StartRecord;
use App\Resolvers\Support\PendingStartSecrets;
use App\Support\ActorIdentity;
use App\Support\AgentSessions;
use App\Support\AgentWakes;
use App\Support\ContainerAdmission;
use App\Support\Drivers\Contracts\DriverAdapters;
use App\Support\InitialWakeSettlement;
use App\Support\RegisterPendingStart;
use App\Support\StartedAgent;
use App\Support\StartReceipt;
use App\Support\StartSessions;
use App\Values\RuntimeIntent;
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
        private ReplyInboxes $replyInboxes,
        private CommandFacts $facts,
        private AgentWakes $wakes,
        private PinnedBuilds $builds,
        private DriverCatalogue $drivers,
        private DriverAdapters $adapters,
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
        $dispatcher = ActorIdentity::of($command->dispatchedBy());

        if ($request->previewRevision !== null && $request->previewRevision !== $this->drivers->revision()) {
            throw StartPreviewStale::since($request->previewRevision, $this->drivers->revision());
        }

        $record = StartRecord::accept(
            $request,
            $this->drivers->pinned($request->selection->driver, $request->variant, $request->neededCapabilities()),
            $dispatcher,
            $this->replyInboxes->replyInboxIdFor($dispatcher),
        );

        // A replay of a start interrupted before its receipt resumes from the evidence its key holds: a session it
        // started, else a reservation the admission finds.
        if ($record->session_id !== null) {
            return $this->receiptOf($request, AgentSession::query()->findOrFail($record->session_id), false);
        }

        // The agent's lifecycle and start reservation, then the host's capacity, then the driver's account, then
        // the session: the order of every start.
        $agent = Agent::query()->findOrFail($request->agentId);
        $this->sessions->reserveStart($agent);

        if (DriverSwitch::openOf($agent->id)?->stage->blocksWriter() === true) {
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

        $parent = $request->parentSessionId === null
            ? null
            : AgentSession::query()->findOrFail($request->parentSessionId);

        $started = $this->starts->startInTransaction(
            $agent,
            $request->selection,
            $request->requestId,
            $parent,
            $request->authorizedSource,
            $this->hostRuntimeOf($request),
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
            $request->authorizedSource,
            $parent?->agent_id,
        ));

        return $this->receiptOf($request, $started->session, true);
    }

    /**
     * A main start runs on the host that runs its driver build, placement and variant, in that host's start folder; a
     * start an owner runs through its own host's start socket opens no runtime here.
     *
     * @throws HostUnavailable
     */
    private function hostRuntimeOf(StartRequest $request): RuntimeIntent|null
    {
        if ($request->origin !== StartOriginType::MainStart) {
            return null;
        }

        $driver = $request->selection->driver;
        $build = $this->builds->versionOf($driver);
        $host = Host::runningStart($driver, $build, $request->execution()->mode, $request->variant);

        return new RuntimeIntent(
            $host->id,
            $host->startFolder(),
            $driver,
            $build,
            $driver,
            $request->variant,
            $request->selection->model,
            null,
            null,
            $request->savesVariant,
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

    private function receiptOf(StartRequest $request, AgentSession $session, bool $newSession): StartReceipt
    {
        $selection = $session->selection();

        return new StartReceipt(
            $request->requestId,
            $session->id,
            $session->agent_id,
            $selection,
            $newSession,
            $request->conversationMode,
            StartReceipt::ACTUAL_MODEL_NOT_REPORTED,
            $this->adapters->for($selection->driver)->modelArguments($selection->model),
        );
    }
}
