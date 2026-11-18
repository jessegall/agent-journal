<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssignmentResult;
use App\Assignments\Support\RecordIdentity;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\Command;
use Domain\Plans\Handlers\AssignPlanWorkHandler;

/**
 * Gives a plan or phase and every unfinished phase and task under it to one holder, in one repeatable-read transaction.
 *
 * @implements Command<AssignmentResult>
 */
#[HandledBy(AssignPlanWorkHandler::class)]
#[RepeatableRead]
final readonly class AssignPlanWork implements Command
{
    public function __construct(
        public RecordIdentity $root,
        public ActorIdentity $recipient,
    ) {}
}
