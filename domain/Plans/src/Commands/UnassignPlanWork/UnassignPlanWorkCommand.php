<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\UnassignPlanWork;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Support\AssignmentReference;
use App\Support\AssignmentResult;
use App\Support\Command;
use App\Support\RecordIdentity;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Releases a plan or phase and its unfinished work from the holder the caller saw, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class UnassignPlanWorkCommand extends Command
{
    public function __construct(
        public RecordIdentity $root,
        public AssignmentReference $expectedRoot,
    ) {}
}
