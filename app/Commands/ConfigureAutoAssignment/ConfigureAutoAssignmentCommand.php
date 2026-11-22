<?php

declare(strict_types=1);

namespace App\Commands\ConfigureAutoAssignment;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Enums\AccessType;
use App\Policies\AssignmentPolicy;
use App\Support\AutoAssignmentChange;
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
