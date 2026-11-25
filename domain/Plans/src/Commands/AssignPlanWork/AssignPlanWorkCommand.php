<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\AssignPlanWork;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\Agents\AccessType;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentResult;
use App\Support\Command;
use App\Support\RecordIdentity;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Gives a plan or phase and every unfinished phase and task under it to one holder, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class AssignPlanWorkCommand extends Command
{
    public function __construct(
        public RecordIdentity $root,
        public AssigneeIdentity $recipient,
    ) {}
}
