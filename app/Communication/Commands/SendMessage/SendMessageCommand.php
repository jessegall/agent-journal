<?php

declare(strict_types=1);

namespace App\Communication\Commands\SendMessage;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
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
