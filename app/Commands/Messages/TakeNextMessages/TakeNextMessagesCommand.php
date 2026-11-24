<?php

declare(strict_types=1);

namespace App\Commands\Messages\TakeNextMessages;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Data\Messages\MessageReadBatch;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Takes up the next waiting messages of one inbox nobody else holds, oldest first; rows another reader is taking are
 * skipped, so two readers never get the same message. An empty batch is an honest answer.
 *
 * @extends Command<MessageReadBatch>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class TakeNextMessagesCommand extends Command
{
    public const int LARGEST_LIMIT = 100;

    public function __construct(
        public string $inboxId,
        public int $limit = 1,
    ) {}
}
