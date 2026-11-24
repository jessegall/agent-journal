<?php

declare(strict_types=1);

namespace App\Commands\Messages\ClaimSpeech;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Claims your turn to speak on one user message of a chat for two minutes; the answer is the token your
 * write presents.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class ClaimSpeechCommand extends Command
{
    public function __construct(
        public string $inboxId,
        public string $rootId,
        public string $batchId,
        public string $grant,
    ) {}
}
