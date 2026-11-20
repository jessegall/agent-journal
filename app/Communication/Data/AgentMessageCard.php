<?php

declare(strict_types=1);

namespace App\Communication\Data;

use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\MessageState;

/** A visible message's envelope, state, and relation to the calling session. */
final readonly class AgentMessageCard
{
    public function __construct(
        public string $id,
        public int $number,
        public string $preview,
        public ActorIdentity $author,
        public string $sourceInboxId,
        public string $recipientInboxId,
        public MessageState $state,
        public int $revision,
        public bool $isQuestion,
        public bool $isUnread,
        public bool $isSelected,
        public bool $isJobSource,
        public string|null $replyToId,
        public string|null $answerId,
        public string|null $dismissalReason,
    ) {}
}
