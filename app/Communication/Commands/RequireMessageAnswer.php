<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Contracts\MessageCommand;
use App\Communication\Handlers\RequireMessageAnswerHandler;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

/**
 * The author of a sent message asks for an answer to it; both inboxes stay as they were.
 *
 * @extends Command<null>
 *
 * @implements MessageCommand<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(RequireMessageAnswerHandler::class)]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class RequireMessageAnswer extends Command implements MessageCommand
{
    public function __construct(public string $messageId) {}
}
