<?php

declare(strict_types=1);

namespace Domain\Plans\Support\States;

use App\Contracts\Events\Event;
use App\Stacks\AgentState;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\Work\DurableState;
use App\Stacks\Contracts\Work\WorkState;
use App\Support\RecordIdentity;
use App\Values\AgentText;
use Domain\Plans\Events\PlanCancelled;
use Domain\Plans\Events\PlanEvent;
use Domain\Plans\Events\PlanFinished;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\Support\WorkOnPlanStateReference;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent working on a started plan. The plan stays open until the state receives it finished or cancelled; it keeps
 * the newest counts it heard for the plan and shows them in its instruction.
 */
#[StateType(WorkOnPlanStateReference::class, schemaVersion: 1)]
final class WorkOnPlanState extends AgentState implements DurableState, WorkState
{
    private bool $isOpen = true;

    private int $number = 0;

    private int $hasFinished = 0;

    private int $total = 0;

    private int $countedAtMicroseconds = 0;

    public function __construct(private readonly string $planId) {}

    public function stateSubject(): RecordIdentity
    {
        return new RecordIdentity(Plan::linkType(), $this->planId);
    }

    public function isFinished(): bool
    {
        return ! $this->isOpen;
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return new Some(AgentText::of('plans.working_on', [
            'plan' => $this->number,
            'finished' => $this->hasFinished,
            'total' => $this->total,
        ]));
    }

    public function listensTo(Event $event): bool
    {
        return ! $event instanceof PlanEvent || $event->planId === $this->planId;
    }

    // ----------[ Events ]----------

    public function onPlanFinished(PlanFinished $event): void
    {
        $this->isOpen = false;
    }

    public function onPlanCancelled(PlanCancelled $event): void
    {
        $this->isOpen = false;
    }

    public function onPlanProgressChanged(PlanProgressChanged $event): void
    {
        if ($event->countedAtMicroseconds >= $this->countedAtMicroseconds) {
            $this->number = $event->planNumber;
            $this->hasFinished = $event->hasFinished;
            $this->total = $event->total;
            $this->countedAtMicroseconds = $event->countedAtMicroseconds;
        }
    }
}
