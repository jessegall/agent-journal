<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Commands\LaunchAgent;
use App\Agents\Events\LaunchAccepted;
use App\Agents\Exceptions\AgentBusy;
use App\Agents\Exceptions\LaunchRefused;
use App\Agents\Exceptions\LaunchRequestConflict;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\LaunchRecord;
use App\Agents\Readers\HostLaunchMaterial;
use App\Agents\Support\LaunchReceipt;
use App\Agents\Support\LaunchRequest;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Launches inside the command's transaction: the request's record first, so a repeat finds its launch; then the
 * session under the agent's shared lifecycle lock, which a retirement waits for; the host hears of it after the
 * commit and receives its token and settings through its own read, never through the receipt.
 */
final readonly class LaunchAgentHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private LaunchSessions $launches,
        private HostLaunchMaterial $material,
        private Dispatcher $events,
    ) {}

    /**
     * @throws LaunchRequestConflict
     * @throws LaunchRefused
     * @throws AgentBusy
     */
    public function handle(LaunchAgent $command): LaunchReceipt
    {
        $request = $command->request;
        $record = LaunchRecord::accept($request, ActorIdentity::of($this->actors->actor()));

        if ($record->session_id !== null) {
            return self::receiptOf($request, AgentSession::query()->findOrFail($record->session_id), false);
        }

        if (AgentSession::query()->runningFor($request->agentId)->exists()) {
            throw AgentBusy::forAgent($request->agentId);
        }

        $parent = $request->parentSessionId === null ? null : AgentSession::query()->findOrFail($request->parentSessionId);
        $launched = $this->launches->launchInTransaction(Agent::query()->findOrFail($request->agentId), $request->selection, $request->requestId, $parent);
        $record->launchedAs($launched->session);
        $this->material->keep($request->requestId, $launched);
        $this->events->dispatch(new LaunchAccepted($request->requestId, $request->agentId, $launched->session->id));

        return self::receiptOf($request, $launched->session, true);
    }

    private static function receiptOf(LaunchRequest $request, AgentSession $session, bool $newSession): LaunchReceipt
    {
        $selection = $session->selection();

        return new LaunchReceipt(
            $request->requestId,
            $session->id,
            $session->agent_id,
            $selection,
            $newSession,
            $request->conversationMode,
            LaunchReceipt::ACTUAL_MODEL_NOT_REPORTED,
            $selection->program->modelArguments($selection->model),
        );
    }
}
