<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Assignments\Support\AssignmentReference;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\ReleaseMessageClaimHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;

/**
 * Ends one stalled claim on a waiting message, naming the exact claim as it was read; a newer claim is never
 * removed. The first read and the message's state stay.
 *
 * @extends Command<null>
 */
#[HandledBy(ReleaseMessageClaimHandler::class)]
#[Operation('release_message_claim', ResourceAreaType::JournalWork, AccessType::Edit)]
#[Authorize(MessagePolicy::class, MessageAbility::Recover)]
#[RepeatableRead]
#[RetainedActorRequestKey]
final readonly class ReleaseMessageClaim extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $messageId,
        public AssignmentReference $expectedClaim,
        public string $reason,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Message::class;
    }
}
