<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\TransferChatOwnership;

use App\Attributes\Authorize;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Support\ActorIdentity;
use App\Support\Command;
use Domain\Chat\Policies\ConversationPolicy;

/**
 * Hands a chat the asker owns to another member, who gets its controls.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class TransferChatOwnershipCommand extends Command
{
    public function __construct(
        public string $inboxId,
        public string $participant,
    ) {}

    /**
     * The member the change is about, written as type:id.
     */
    public function participantIdentity(): ActorIdentity
    {
        return ActorIdentity::fromText($this->participant);
    }
}
