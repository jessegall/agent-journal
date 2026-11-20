<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\AskMessageHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Sends a message from one inbox to another that waits for an answer; the answer is the new message id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(AskMessageHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
final readonly class AskMessage extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $sourceInboxId,
        public string $destinationInboxId,
        #[Required]
        public string $body,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Message::class;
    }
}
