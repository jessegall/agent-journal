<?php

declare(strict_types=1);

namespace App\Commands\UnassignRecord;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
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
