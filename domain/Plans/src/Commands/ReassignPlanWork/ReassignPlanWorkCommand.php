<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\ReassignPlanWork;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Enums\Agents\AccessType;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use App\Support\AssignmentResult;
use App\Support\Command;
use App\Support\RecordIdentity;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Moves a plan or phase and its unfinished work from the holder the caller saw to another, in one repeatable-read
 * transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class ReassignPlanWorkCommand extends Command
{
    public function __construct(
        public RecordIdentity $root,
        public AssignmentReference $expectedRoot,
        public AssigneeIdentity $recipient,
    ) {}
}
