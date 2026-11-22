<?php

declare(strict_types=1);

namespace App\Assignments\Commands\ConfigureAutoAssignment;

use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Support\AutoAssignmentChange;
use App\Assignments\Support\AutoAssignmentInput;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

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
