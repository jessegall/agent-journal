<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Records\Support\RecordIdentity;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Handlers\AssignPlanWorkHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Gives a plan or phase and every unfinished phase and task under it to one holder, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(AssignPlanWorkHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
#[Operation('assign_plan_work', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class AssignPlanWork extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public RecordIdentity $root,
        public AssigneeIdentity $recipient,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Plan::class;
    }
}
