<?php

declare(strict_types=1);

namespace App\Communication\Commands\AskMessage;

use App\Agents\Values\SeenSession;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\TargetedCommand;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
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
