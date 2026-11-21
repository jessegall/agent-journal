<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ReplyInboxes;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\AgentSessions;
use App\Agents\Actions\RegisterPendingStart;
use App\Agents\Actions\StartSessions;
use App\Agents\Commands\StartAgent;
use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Events\StartAccepted;
use App\Agents\Exceptions\AgentBusy;
use App\Agents\Exceptions\HostUnavailable;
use App\Agents\Exceptions\StartRefused;
use App\Agents\Exceptions\StartRequestConflict;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverSwitch;
use App\Agents\Models\Host;
use App\Agents\Models\SessionPolicy;
use App\Agents\Models\StartRecord;
use App\Agents\Resolvers\Support\PendingStartSecrets;
use App\Agents\Support\AgentWakes;
use App\Agents\Support\ContainerAdmission;
use App\Agents\Support\StartedAgent;
use App\Agents\Support\StartReceipt;
use App\Agents\Values\RuntimeIntent;
use App\Agents\Values\StackTarget;
use App\Agents\Values\StartRequest;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Hooks\Compatibility\DriverCompatibility;

/**
 * Starts inside the command's transaction: the request's record first, so a repeat finds its start; then the
 * session under the agent's shared lifecycle lock, which a retirement waits for; the host is told after the
 * commit and receives its token and settings through its own read, never through the receipt.
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
    ) {}

    /**
     * @throws StartRequestConflict
     * @throws StartRefused
     * @throws AgentBusy
     */
    public function handle(StartAgent $command): StartReceipt
    {
        $request = $command->request;
        $dispatcher = ActorIdentity::of($command->dispatchedBy());
        $record = StartRecord::accept($request, $dispatcher, $this->replyInboxes->replyInboxIdFor($dispatcher));

        if ($record->session_id !== null) {
            return self::receiptOf($request, AgentSession::query()->findOrFail($record->session_id), false);
        }

        // The agent's lifecycle and start reservation, then the host's capacity, then the program's account, then
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
            self::hostRuntimeOf($request),
        );
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
        ));

        return self::receiptOf($request, $started->session, true);
    }

    /**
     * A main start runs on the host that runs its driver build, placement and variant, in that host's start folder; a
     * start an owner runs through its own host's start socket opens no runtime here.
     *
     * @throws HostUnavailable
     */
    private static function hostRuntimeOf(StartRequest $request): RuntimeIntent|null
    {
        if ($request->origin !== StartOriginType::MainStart) {
            return null;
        }

        $driver = $request->selection->driver;
        $build = DriverCompatibility::pinned($driver)->version;
        $host = Host::runningStart($driver, $build, $request->execution()->mode, $request->variant);

        return new RuntimeIntent(
            $host->id,
            $host->startFolder(),
            $driver->value,
            $build,
            $driver->value,
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
            'start-'.$started->session->id,
        );
    }

    private static function receiptOf(StartRequest $request, AgentSession $session, bool $newSession): StartReceipt
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
            $selection->driver->modelArguments($selection->model),
        );
    }
}
