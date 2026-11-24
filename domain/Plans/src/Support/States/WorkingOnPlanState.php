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
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\PlanRecords;
use Domain\Plans\Support\States\Support\WorkingOnPlanStateReference;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent working on a started plan. The plan stays open until the state hears it finished or cancelled; its
 * instruction reads the plan's card, with its counts, each time it is shown.
 */
#[StateType(WorkingOnPlanStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class WorkingOnPlanState extends AgentState
{
    private bool $isOpen = true;

    public function __construct(
        private readonly string $planId,
        private readonly PlanRecords $plans
    ) {}

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
        return new Some(Plan::LINK_TYPE);
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        $card = $this->plans->cardOf(Plan::query()->whereKey($this->planId)->readExactly(1)->sole());

        return new Some(AgentText::of('plans.working_on', [
            'plan' => $card->number,
            'finished' => $card->progress->finished,
            'total' => $card->progress->total,
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
}
