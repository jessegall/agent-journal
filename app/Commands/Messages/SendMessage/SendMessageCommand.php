<?php

declare(strict_types=1);

namespace App\Commands\Messages\SendMessage;

use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Sends a message into an inbox the actor is attached to, or as the journal into any inbox, as a reply to the target
 * message when one is given; the answer is the new message's id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
final readonly class SendMessageCommand extends Command
{
    public function __construct(
        public string $inboxId,
        #[Required]
        public string $body,
        public int|null $targetMessageNumber = null,
    ) {}
}
