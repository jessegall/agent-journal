<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ReplyInboxes;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\StartSessions;
use App\Agents\Commands\StartAgent;
use App\Agents\Contracts\HelperImages;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostCapabilityType;
use App\Agents\Events\StartAccepted;
use App\Agents\Exceptions\AccountContainerUnsupported;
use App\Agents\Exceptions\AgentBusy;
use App\Agents\Exceptions\CapacityUnavailable;
use App\Agents\Exceptions\ContainerUnavailable;
use App\Agents\Exceptions\ImageUnverified;
use App\Agents\Exceptions\StartRefused;
use App\Agents\Exceptions\StartRequestConflict;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\CapacityReservation;
use App\Agents\Models\SessionPolicy;
use App\Agents\Models\StartRecord;
use App\Agents\Resolvers\Support\HostStartMaterial;
use App\Agents\Support\HostCapabilityQuery;
use App\Agents\Support\HostCapacity;
use App\Agents\Support\HostCapacityLock;
use App\Agents\Support\StartReceipt;
use App\Agents\Support\StartRequest;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Starts inside the command's transaction: the request's record first, so a repeat finds its start; then the
 * session under the agent's shared lifecycle lock, which a retirement waits for; the host hears of it after the
 * commit and receives its token and settings through its own read, never through the receipt.
 */
final readonly class StartAgentHandler implements CommandHandler
{
    public function __construct(
        private StartSessions $starts,
        private HostStartMaterial $material,
        private Dispatcher $events,
        private HostCapabilities $capabilities,
        private HelperImages $images,
        private HostCapacity $capacity,
        private HostCapacityLock $capacityLock,
        private ReplyInboxes $replyInboxes,
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

        if (AgentSession::query()->runningFor($request->agentId)->exists()) {
            throw AgentBusy::forAgent($request->agentId);
        }

        if ($request->execution()->mode === ExecutionModeType::RequiredContainer) {
            $this->admitContainer($request);
        }

        $parent = $request->parentSessionId === null
            ? null
            : AgentSession::query()->findOrFail($request->parentSessionId);
        $started = $this->starts->startInTransaction(
            Agent::query()->findOrFail($request->agentId),
            $request->selection,
            $request->requestId,
            $parent,
        );
        SessionPolicy::freeze($started->session, $request->policy);
        $record->startedAs($started->session);
        $this->material->keep($request->requestId, $started);
        $this->events->dispatch(new StartAccepted($request->requestId, $request->agentId, $started->session->id));

        return self::receiptOf($request, $started->session, true);
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
            $selection->program->modelArguments($selection->model),
        );
    }

    /**
     * A required container start needs a proven container runtime, a proven account transport and the verified
     * image before it reserves its share of the host; it never falls back to the host.
     *
     * @throws ContainerUnavailable
     * @throws AccountContainerUnsupported
     * @throws ImageUnverified
     * @throws CapacityUnavailable
     */
    private function admitContainer(StartRequest $request): void
    {
        foreach ([HostCapabilityType::ContainerRuntime, HostCapabilityType::AccountTransport] as $capability) {
            $query = new HostCapabilityQuery(
                $capability,
                $request->selection->program,
                AccountModeType::Subscription,
                ExecutionModeType::RequiredContainer,
            );
            $this->capabilities->capability($query)->requireSupported();
        }

        if (! $this->images->isVerified((string) $request->execution()->imageReference)) {
            throw ImageUnverified::because((string) $request->execution()->imageReference);
        }

        $this->capacityLock->holdUntilCommit();
        CapacityReservation::reserve($request->requestId, $request->execution()->budgets, $this->capacity);
    }
}
