<?php

declare(strict_types=1);

namespace App\Commands\Assignments\UnassignRecord;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Enums\Agents\AccessType;
use App\Policies\AssignmentPolicy;
use App\Support\AssignmentReference;
use App\Support\AssignmentResult;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * Releases one record from the holder the caller saw, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(AssignmentPolicy::class, AccessType::Edit)]
final readonly class UnassignRecordCommand extends Command
{
    public function __construct(
        public RecordIdentity $record,
        public AssignmentReference $expected,
    ) {}
}
