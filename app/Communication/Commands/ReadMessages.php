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
 * Reads up to a hundred messages of one inbox: the first read of each is kept, and the reader takes up each one that
 * waits for an answer and nobody holds.
 *
 * @extends Command<MessageReadBatch>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class ReadMessages extends Command
{
    /**
     * @param  list<string>  $messageIds
     */
    public function __construct(
        public string $inboxId,
        public array $messageIds,
    ) {}
}
