<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Records\Support\RecordIdentity;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Handlers\UnassignPlanWorkHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Releases a plan or phase and its unfinished work from the holder the caller saw, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(UnassignPlanWorkHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
final readonly class UnassignPlanWork extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public RecordIdentity $root,
        public AssignmentReference $expectedRoot,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Plan::class;
    }
}
