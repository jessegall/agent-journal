<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Handlers\DisableAutoAssignmentHandler;
use App\Assignments\Support\AutoAssignmentChange;
use App\Assignments\Support\AutoAssignmentKey;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\Command;

/**
 * Turns an actor's auto-assignment of one type off against the revision the caller read, keeping its pool and size.
 *
 * @implements Command<AutoAssignmentChange>
 */
#[HandledBy(DisableAutoAssignmentHandler::class)]
#[RepeatableRead]
final readonly class DisableAutoAssignment implements Command
{
    public function __construct(
        public AutoAssignmentKey $key,
        public int $expectedRevision,
    ) {}
}
