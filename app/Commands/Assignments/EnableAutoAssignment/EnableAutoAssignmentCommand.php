<?php

declare(strict_types=1);

namespace App\Commands\Assignments\EnableAutoAssignment;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Enums\Agents\AccessType;
use App\Policies\AssignmentPolicy;
use App\Support\AutoAssignmentChange;
use App\Support\AutoAssignmentInput;
use App\Support\Command;

/**
 * Turns an actor's auto-assignment of one type on with a pool and size, against the revision the caller read.
 *
 * @extends Command<AutoAssignmentChange>
 */
#[RepeatableRead]
#[Authorize(AssignmentPolicy::class, AccessType::Edit)]
final readonly class EnableAutoAssignmentCommand extends Command
{
    public function __construct(
        public AutoAssignmentInput $input,
        public int $expectedRevision,
    ) {}
}
