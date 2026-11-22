<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Data\MessageReadBatch;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

/**
 * Marks up to a hundred messages of one chat shown to the reader, through its active interval: a message it never
 * received, or one already shown, changes nothing. A wake is never a read.
 *
 * @extends Command<MessageReadBatch>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class AcknowledgeChatMessages extends Command
{
    /**
     * @param  list<string>  $messageIds
     */
    public function __construct(
        public string $inboxId,
        public array $messageIds,
    ) {}
}
