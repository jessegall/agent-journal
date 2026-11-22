<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

/**
 * Claims your turn to speak on one user message of a chat for two minutes; the answer is the token your
 * write presents.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class ClaimSpeech extends Command
{
    public function __construct(
        public string $inboxId,
        public string $rootId,
        public string $batchId,
        public string $grant,
    ) {}
}
