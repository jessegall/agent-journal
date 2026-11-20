<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Communication\Data\MessageReadBatch;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\ReadMessagesHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;

/**
 * Reads up to a hundred messages of one inbox: the first read of each is kept, and the reader takes up each one that
 * waits for an answer and nobody holds.
 *
 * @extends Command<MessageReadBatch>
 */
#[HandledBy(ReadMessagesHandler::class)]
#[Operation('messages_read', ResourceAreaType::JournalWork, AccessType::Edit)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
#[RepeatableRead]
#[RetainedActorRequestKey]
final readonly class ReadMessages extends Command implements HasAuthorizationSubject
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
