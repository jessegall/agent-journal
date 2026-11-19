<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Enums\AssignmentAbility;
use App\Assignments\Handlers\ReassignRecordHandler;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Records\Support\RecordIdentity;

/**
 * Moves one record from the holder the caller saw to another, in one repeatable-read transaction.
 *
 * @implements Command<AssignmentResult>
 */
#[HandledBy(ReassignRecordHandler::class)]
#[Authorize(AssignmentPolicy::class, AssignmentAbility::Work)]
#[RepeatableRead]
final readonly class ReassignRecord implements Command, HasAuthorizationSubject
{
    public function __construct(
        public RecordIdentity $record,
        public AssignmentReference $expected,
        public ActorIdentity $recipient,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return AssignmentRecord::class;
    }
}
