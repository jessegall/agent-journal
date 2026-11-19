<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Enums\AssignmentAbility;
use App\Assignments\Handlers\ConfigureAutoAssignmentHandler;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Support\AutoAssignmentChange;
use App\Assignments\Support\AutoAssignmentInput;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;

/**
 * Gives an actor's auto-assignment of one type a new pool and size, against the revision the caller read.
 *
 * @extends Command<AutoAssignmentChange>
 */
#[HandledBy(ConfigureAutoAssignmentHandler::class)]
#[Authorize(AssignmentPolicy::class, AssignmentAbility::Work)]
#[RepeatableRead]
final readonly class ConfigureAutoAssignment extends Command implements HasAuthorizationSubject
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
