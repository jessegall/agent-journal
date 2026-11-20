<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Support\RecordIdentity;
use Domain\Plans\Handlers\ReassignPlanWorkHandler;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Moves a plan or phase and its unfinished work from the holder the caller saw to another, in one repeatable-read
 * transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(ReassignPlanWorkHandler::class)]
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class ReassignPlanWork extends Command
{
    public function __construct(
        public RecordIdentity $root,
        public AssignmentReference $expectedRoot,
        public AssigneeIdentity $recipient,
    ) {}
}
