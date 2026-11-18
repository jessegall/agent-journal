<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Handlers\ConfigureAutoAssignmentHandler;
use App\Assignments\Support\AutoAssignmentChange;
use App\Assignments\Support\AutoAssignmentInput;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\Command;

/**
 * Gives an actor's auto-assignment of one type a new pool and size, against the revision the caller read.
 *
 * @implements Command<AutoAssignmentChange>
 */
#[HandledBy(ConfigureAutoAssignmentHandler::class)]
#[RepeatableRead]
final readonly class ConfigureAutoAssignment implements Command
{
    public function __construct(
        public AutoAssignmentInput $input,
        public int $expectedRevision,
    ) {}
}
