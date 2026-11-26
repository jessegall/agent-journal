<?php

declare(strict_types=1);

namespace App\Assignments\Commands\ReassignRecord;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Policies\AssignmentPolicy;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use App\Support\AssignmentResult;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * Moves one record from the holder the caller saw to another, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(AssignmentPolicy::class, AccessType::Edit)]
final readonly class ReassignRecordCommand extends Command
{
    public function __construct(
        public RecordIdentity $record,
        public AssignmentReference $expected,
        public AssigneeIdentity $recipient,
    ) {}
}
