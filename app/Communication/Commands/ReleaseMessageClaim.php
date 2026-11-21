<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Assignments\Support\AssignmentReference;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Contracts\MessageCommand;
use App\Communication\Policies\MessageAdministrationPolicy;
use App\Operations\Enums\AccessType;

/**
 * Ends one stalled claim on a waiting message, naming the exact claim as it was read; a newer claim is never
 * removed. The first read and the message's state stay.
 *
 * @extends Command<null>
 *
 * @implements MessageCommand<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessageAdministrationPolicy::class, AccessType::Edit)]
final readonly class ReleaseMessageClaim extends Command implements MessageCommand
{
    public function __construct(
        public string $messageId,
        public AssignmentReference $expectedClaim,
        public string $reason,
    ) {}
}
