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
use App\Communication\Handlers\RequireMessageAnswerHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;

/**
 * The author of a sent message asks for an answer to it; both inboxes stay as they were.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(RequireMessageAnswerHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
final readonly class RequireMessageAnswer extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $messageId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Message::class;
    }
}
