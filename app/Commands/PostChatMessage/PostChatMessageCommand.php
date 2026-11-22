<?php

declare(strict_types=1);

namespace App\Commands\PostChatMessage;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Contracts\TargetedCommand;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\ActorIdentity;
use App\Support\Command;
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
final readonly class PostChatMessageCommand extends Command implements TargetedCommand
{
    public function __construct(
        public string $inboxId,
        #[Required]
        public string $body,
        #[Required]
        public string $requestKey,
        public string|null $claimToken = null,
        public string|null $addresseeText = null,
    ) {}

    /**
     * The member the post is addressed to, written as type:id, when one is named.
     */
    public function addressee(): ActorIdentity|null
    {
        return $this->addresseeText === null ? null : ActorIdentity::fromText($this->addresseeText);
    }

    public static function targetOf(string $inboxId): string
    {
        return "chat-post:{$inboxId}";
    }

    public function receiptTarget(): string
    {
        return self::targetOf($this->inboxId);
    }
}
