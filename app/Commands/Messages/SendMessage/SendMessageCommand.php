<?php

declare(strict_types=1);

namespace App\Commands\Messages\SendMessage;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Sends a message from one inbox to another; the answer is the new message id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class SendMessageCommand extends Command
{
    public function __construct(
        public string $sourceInboxId,
        public string $destinationInboxId,
        #[Required]
        public string $body,
    ) {}
}
