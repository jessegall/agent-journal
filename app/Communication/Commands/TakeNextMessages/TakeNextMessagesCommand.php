<?php

declare(strict_types=1);

namespace App\Communication\Commands\TakeNextMessages;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Data\MessageReadBatch;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

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
