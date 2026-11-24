<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReleaseSpeech;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Gives up your claim on a turn to speak, so it is offered again.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class ReleaseSpeechCommand extends Command
{
    public function __construct(
        public string $inboxId,
        public string $rootId,
    ) {}
}
