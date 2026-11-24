<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReplyInChat;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Contracts\Bus\TargetedCommand;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Replies to a chat message in the chat it was posted in; naming that chat is optional and checked. A retry under the
 * same request key answers the same reply. The answer is the reply's id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class ReplyInChatCommand extends Command implements TargetedCommand
{
    public function __construct(
        public string $parentId,
        #[Required]
        public string $body,
        #[Required]
        public string $requestKey,
        public string|null $inboxId = null,
        public string|null $claimToken = null,
    ) {}

    public static function targetOf(string $parentId): string
    {
        return "reply:{$parentId}";
    }

    public function receiptTarget(): string
    {
        return self::targetOf($this->parentId);
    }
}
