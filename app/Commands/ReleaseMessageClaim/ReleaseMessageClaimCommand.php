<?php

declare(strict_types=1);

namespace App\Commands\ReleaseMessageClaim;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Contracts\MessageCommand;
use App\Enums\AccessType;
use App\Policies\MessageAdministrationPolicy;
use App\Support\AssignmentReference;
use App\Support\Command;

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
final readonly class ReleaseMessageClaimCommand extends Command implements MessageCommand
{
    public function __construct(
        public string $messageId,
        public AssignmentReference $expectedClaim,
        public string $reason,
    ) {}
}
