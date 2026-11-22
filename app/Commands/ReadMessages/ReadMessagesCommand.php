<?php

declare(strict_types=1);

namespace App\Commands\ReadMessages;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Data\MessageReadBatch;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Reads up to a hundred messages of one inbox: the first read of each is kept, and the reader takes up each one that
 * waits for an answer and nobody holds.
 *
 * @extends Command<MessageReadBatch>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class ReadMessagesCommand extends Command
{
    /**
     * @param  list<string>  $messageIds
     */
    public function __construct(
        public string $inboxId,
        public array $messageIds,
    ) {}
}
