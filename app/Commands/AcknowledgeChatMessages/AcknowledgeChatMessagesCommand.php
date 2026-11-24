<?php

declare(strict_types=1);

namespace App\Commands\AcknowledgeChatMessages;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Data\Messages\MessageReadBatch;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Marks up to a hundred messages of one chat shown to the reader, through its active interval: a message it never
 * received, or one already shown, changes nothing. A wake is never a read.
 *
 * @extends Command<MessageReadBatch>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class AcknowledgeChatMessagesCommand extends Command
{
    /**
     * @param  list<string>  $messageIds
     */
    public function __construct(
        public string $inboxId,
        public array $messageIds,
    ) {}
}
