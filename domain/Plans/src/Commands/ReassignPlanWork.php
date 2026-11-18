<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\Command;
use App\Records\Support\RecordIdentity;
use Domain\Plans\Handlers\ReassignPlanWorkHandler;

/**
 * Moves a plan or phase and its unfinished work from the holder the caller saw to another, in one repeatable-read transaction.
 *
 * @implements Command<AssignmentResult>
 */
#[HandledBy(ReassignPlanWorkHandler::class)]
#[RepeatableRead]
final readonly class ReassignPlanWork implements Command
{
    public function __construct(
        public RecordIdentity $root,
        public AssignmentReference $expectedRoot,
        public ActorIdentity $recipient,
    ) {}
}
