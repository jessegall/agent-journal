<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\ReplyToMessageHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Answers a message from its destination inbox, naming the state version the replier saw; the answer goes back to
 * the message's source inbox. The answer is the reply's id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Effect(CommandEffectType::Recovery)]
#[HandledBy(ReplyToMessageHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
#[Operation('messages_reply', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class ReplyToMessage extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $messageId,
        public int $expectedStateVersion,
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
