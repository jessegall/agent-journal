<?php

declare(strict_types=1);

namespace Domain\Plans\Support\States;

use App\Attributes\StateType;
use App\Enums\FrameReuse;
use App\Enums\SessionTransferType;
use App\Support\States\AgentState;
use App\Values\AgentText;
use Domain\Plans\Events\PlanCancelled;
use Domain\Plans\Events\PlanFinished;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\Support\WorkOnPlanStateReference;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent working on a started plan. The plan stays open until the state hears it finished or cancelled; it keeps
 * the newest counts it heard for the plan and shows them in its instruction.
 */
#[StateType(WorkOnPlanStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class WorkOnPlanState extends AgentState
{
    private bool $isOpen = true;

    private int $number = 0;

    private int $hasFinished = 0;

    private int $total = 0;

    private int $countedAtMicroseconds = 0;

    public function __construct(private readonly string $planId) {}

    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerSubject;
    }

    public function isFinished(): bool
    {
        return ! $this->isOpen;
    }

    /**
     * @return Option<string>
     */
    public function workRecordType(): Option
    {
        return new Some(Plan::linkType());
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

    // ----------[ Events ]----------

    public function onPlanFinished(PlanFinished $event): void
    {
        if ($event->planId === $this->planId) {
            $this->isOpen = false;
        }
    }

    public function onPlanCancelled(PlanCancelled $event): void
    {
        if ($event->planId === $this->planId) {
            $this->isOpen = false;
        }
    }

    public function onPlanProgressChanged(PlanProgressChanged $event): void
    {
        if ($event->planId === $this->planId && $event->countedAtMicroseconds >= $this->countedAtMicroseconds) {
            $this->number = $event->planNumber;
            $this->hasFinished = $event->hasFinished;
            $this->total = $event->total;
            $this->countedAtMicroseconds = $event->countedAtMicroseconds;
        }
    }
}
