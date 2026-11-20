<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Support\RecordIdentity;
use Domain\Plans\Handlers\AssignPlanWorkHandler;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Gives a plan or phase and every unfinished phase and task under it to one holder, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(AssignPlanWorkHandler::class)]
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class AssignPlanWork extends Command
{
    public function __construct(
        public RecordIdentity $root,
        public AssigneeIdentity $recipient,
    ) {}
}
