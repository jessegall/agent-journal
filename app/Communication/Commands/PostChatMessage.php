<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Posts a message in a chat the author is a member of; a retry under the same request key answers the same message.
 * The answer is the message id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class PostChatMessage extends Command
{
    public function __construct(
        public string $inboxId,
        #[Required]
        public string $body,
        #[Required]
        public string $requestKey,
    ) {}
}
