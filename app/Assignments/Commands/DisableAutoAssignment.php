<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Enums\AssignmentAbility;
use App\Assignments\Handlers\DisableAutoAssignmentHandler;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Support\AutoAssignmentChange;
use App\Assignments\Support\AutoAssignmentKey;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * Turns an actor's auto-assignment of one type off against the revision the caller read, keeping its pool and size.
 *
 * @extends Command<AutoAssignmentChange>
 */
#[RepeatableRead]
#[HandledBy(DisableAutoAssignmentHandler::class)]
#[Authorize(AssignmentPolicy::class, AssignmentAbility::Work)]
#[Operation('disable_auto_assignment', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class DisableAutoAssignment extends Command implements AuthorizedCommand
{
    public function __construct(
        public AutoAssignmentKey $key,
        public int $expectedRevision,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return AssignmentRecord::class;
    }
}
