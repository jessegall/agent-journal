<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Enums\AssignmentAbility;
use App\Assignments\Handlers\ReassignRecordHandler;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Records\Support\RecordIdentity;

/**
 * Moves one record from the holder the caller saw to another, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[HandledBy(ReassignRecordHandler::class)]
#[Authorize(AssignmentPolicy::class, AssignmentAbility::Work)]
#[RepeatableRead]
#[RetainedActorRequestKey]
final readonly class ReassignRecord extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public RecordIdentity $record,
        public AssignmentReference $expected,
        public AssigneeIdentity $recipient,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return AssignmentRecord::class;
    }
}
