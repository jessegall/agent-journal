<?php

declare(strict_types=1);

namespace App\Commands\Messages\AcknowledgeMessageBatch;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Confirms the pieces of one message batch the agent's driver actually showed, by their handles; a body becomes
 * read only once its whole text was confirmed in that driver context. The answer is how many pieces changed.
 *
 * @extends Command<int>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class AcknowledgeMessageBatchCommand extends Command
{
    /**
     * @param  list<string>  $handles
     */
    public function __construct(
        public string $batchId,
        public array $handles,
        public string $contextKey,
    ) {}
}
