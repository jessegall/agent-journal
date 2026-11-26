<?php

declare(strict_types=1);

namespace App\Assignments\Commands\ConfigureAutoAssignment;

use App\Agents\Enums\AccessType;
use App\Assignments\AutoAssignmentChange;
use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Policies\AssignmentPolicy;
use App\Support\AutoAssignmentInput;
use App\Support\Command;

/**
 * Gives an actor's auto-assignment of one type a new pool and size, against the revision the caller read.
 *
 * @extends Command<AutoAssignmentChange>
 */
#[RepeatableRead]
#[Authorize(AssignmentPolicy::class, AccessType::Create)]
final readonly class ConfigureAutoAssignmentCommand extends Command
{
    public function __construct(
        public AutoAssignmentInput $input,
        public int $expectedRevision,
    ) {}
}
