<?php

declare(strict_types=1);

namespace App\Commands\Assignments\DisableAutoAssignment;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Enums\Agents\AccessType;
use App\Policies\AssignmentPolicy;
use App\Support\AutoAssignmentChange;
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
