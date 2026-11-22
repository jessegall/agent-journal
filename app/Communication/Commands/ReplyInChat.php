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
 * Replies to a chat message in the chat it was posted in; naming that chat is optional and checked. A retry under the
 * same request key answers the same reply. The answer is the reply's id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class ReplyInChat extends Command
{
    public function __construct(
        public string $parentId,
        #[Required]
        public string $body,
        #[Required]
        public string $requestKey,
        public string|null $inboxId = null,
    ) {}

    /**
     * Whether the caller named a chat other than the one the parent was posted in.
     */
    public function namesAnotherInboxThan(string $inboxId): bool
    {
        return $this->inboxId !== null && $this->inboxId !== $inboxId;
    }
}
