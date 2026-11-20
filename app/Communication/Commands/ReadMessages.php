<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Communication\Data\MessageReadBatch;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\ReadMessagesHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * Reads up to a hundred messages of one inbox: the first read of each is kept, and the reader takes up each one that
 * waits for an answer and nobody holds.
 *
 * @extends Command<MessageReadBatch>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(ReadMessagesHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
#[Operation('messages_acknowledge', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ReadMessages extends Command implements AuthorizedCommand
{
    /**
     * @param  list<string>  $messageIds
     */
    public function __construct(
        public string $inboxId,
        public array $messageIds,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Message::class;
    }
}
