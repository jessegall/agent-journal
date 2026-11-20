<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Enums\AssignmentAbility;
use App\Assignments\Handlers\EnableAutoAssignmentHandler;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Support\AutoAssignmentChange;
use App\Assignments\Support\AutoAssignmentInput;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * Turns an actor's auto-assignment of one type on with a pool and size, against the revision the caller read.
 *
 * @extends Command<AutoAssignmentChange>
 */
#[RepeatableRead]
#[HandledBy(EnableAutoAssignmentHandler::class)]
#[Authorize(AssignmentPolicy::class, AssignmentAbility::Work)]
final readonly class EnableAutoAssignment extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public AutoAssignmentInput $input,
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
