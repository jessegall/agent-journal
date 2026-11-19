<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\RequireMessageAnswerHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;

/**
 * Asks the agent of a session to answer a message.
 *
 * @implements Command<null>
 */
#[HandledBy(RequireMessageAnswerHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
final readonly class RequireMessageAnswer implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $messageId,
        public ActorIdentity $recipient,
        public int $currentRound,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Message::class;
    }
}
