<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\RemoveChatParticipant;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Chat\Policies\ConversationPolicy;

/**
 * Removes a member from a chat the asker owns; its open questions close because their respondent left.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class RemoveChatParticipantCommand extends Command
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
