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
use App\Communication\Handlers\TakeNextMessagesHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;

/**
 * Takes up the next waiting messages of one inbox nobody else holds, oldest first; rows another reader is taking are
 * skipped, so two readers never get the same message. An empty batch is an honest answer.
 *
 * @extends Command<MessageReadBatch>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(TakeNextMessagesHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
#[Operation('messages_take_next', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class TakeNextMessages extends Command implements HasAuthorizationSubject
{
    public const int LARGEST_LIMIT = 100;

    public function __construct(
        public string $inboxId,
        public int $limit = 1,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Message::class;
    }
}
