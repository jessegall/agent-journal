<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Chat\Policies\ConversationPolicy;

/**
 * Hands a chat the asker owns to another member, who gets its controls.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class TransferChatOwnership extends Command
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
