<?php

declare(strict_types=1);

namespace App\Assignments\Commands\DisableAutoAssignment;

use App\Agents\Enums\AccessType;
use App\Assignments\AutoAssignmentChange;
use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Policies\AssignmentPolicy;
use App\Support\AutoAssignmentKey;
use App\Support\Command;

/**
 * Turns an actor's auto-assignment of one type off against the revision the caller read, keeping its pool and size.
 *
 * @extends Command<AutoAssignmentChange>
 */
#[RepeatableRead]
#[Authorize(AssignmentPolicy::class, AccessType::Edit)]
final readonly class DisableAutoAssignmentCommand extends Command
{
    public function __construct(
        public AutoAssignmentKey $key,
        public int $expectedRevision,
    ) {}
}
