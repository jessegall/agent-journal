<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Agents\Commands\RecordAgentModel\RecordAgentModelCommand;
use App\Agents\Drivers\Contracts\DriverRequestEvent;
use App\Contracts\Events\Event;
use App\Events\Sessions\DriverRequestApplied;
use App\Events\Sessions\DriverRequestCancelled;
use App\Events\Sessions\DriverRequestRepaired;
use App\Events\Sessions\DriverRequestResolvedAsNotApplied;
use App\Events\Sessions\DriverRequestSuperseded;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\Work\DurableState;
use App\Stacks\Support\ChangeModelStateReference;

/**
 * A session asked to run at another model: it holds the model and the driver request that carries it, and once the
 * driver applied the request it records the model on the session's runtime, so every later start runs at it. A
 * request cancelled, superseded or resolved as not applied ends it with nothing recorded.
 */
#[StateType(ChangeModelStateReference::class, schemaVersion: 1)]
final class ChangeModelState extends AgentState implements DurableState
{
    private bool $isSettled = false;

    public function __construct(
        private readonly string $agentId,
        private readonly string $sessionId,
        private readonly string $requestId,
        private string $model,
    ) {}

    public function isFinished(): bool
    {
        return $this->isSettled;
    }

    public function listensTo(Event $event): bool
    {
        return $event instanceof DriverRequestEvent && $event->requestId === $this->requestId;
    }

    // ----------[ Events ]----------

    public function onDriverRequestApplied(DriverRequestApplied $event): RecordAgentModelCommand
    {
        $this->isSettled = true;

        return new RecordAgentModelCommand($this->agentId, $this->sessionId, $this->model);
    }

    /**
     * The request was repaired with another model, which is the one the driver applies now.
     */
    public function onDriverRequestRepaired(DriverRequestRepaired $event): void
    {
        $this->model = $event->setting;
    }

    public function onDriverRequestCancelled(DriverRequestCancelled $event): void
    {
        $this->isSettled = true;
    }

    public function onDriverRequestSuperseded(DriverRequestSuperseded $event): void
    {
        $this->isSettled = true;
    }

    public function onDriverRequestResolvedAsNotApplied(DriverRequestResolvedAsNotApplied $event): void
    {
        $this->isSettled = true;
    }
}
