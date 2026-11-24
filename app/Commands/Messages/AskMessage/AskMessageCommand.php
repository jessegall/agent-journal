<?php

declare(strict_types=1);

namespace App\Commands\Messages\AskMessage;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Contracts\Bus\TargetedCommand;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;
use App\Values\SeenSession;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Sends a message from one inbox to another that waits for an answer; the answer is the new message id. A user's
 * send names the agent session it saw, which is checked when the send first runs, under its request key.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class AskMessageCommand extends Command implements TargetedCommand
{
    public function __construct(
        public string $sourceInboxId,
        public string $destinationInboxId,
        #[Required]
        public string $body,
        public SeenSession|null $seenSession = null,
    ) {}

    /**
     * What a send between these inboxes writes to, as its receipt keeps it.
     */
    public static function targetOf(string $sourceInboxId, string $destinationInboxId): string
    {
        return "send:{$sourceInboxId}:{$destinationInboxId}";
    }

    public function receiptTarget(): string
    {
        return self::targetOf($this->sourceInboxId, $this->destinationInboxId);
    }
}
