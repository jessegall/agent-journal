<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Support\AutoAssignmentChange;
use App\Assignments\Support\AutoAssignmentKey;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Turns an actor's auto-assignment of one type off against the revision the caller read, keeping its pool and size.
 *
 * @extends Command<AutoAssignmentChange>
 */
#[RepeatableRead]
#[Authorize(AssignmentPolicy::class, AccessType::Edit)]
final readonly class DisableAutoAssignment extends Command
{
    public function __construct(
        public AutoAssignmentKey $key,
        public int $expectedRevision,
    ) {}
}
