<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\SendMessageHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;

/**
 * Sends a message to the agent of a session and asks it for an answer.
 *
 * @implements Command<null>
 */
#[HandledBy(SendMessageHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
final readonly class SendMessage implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $body,
        public ActorIdentity $recipient,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Message::class;
    }
}
