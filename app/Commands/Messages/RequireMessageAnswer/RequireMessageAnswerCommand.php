<?php

declare(strict_types=1);

namespace App\Commands\Messages\RequireMessageAnswer;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Contracts\Bus\MessageCommand;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * The author of a sent message asks for an answer to it; both inboxes stay as they were.
 *
 * @extends Command<null>
 *
 * @implements MessageCommand<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class RequireMessageAnswerCommand extends Command implements MessageCommand
{
    public function __construct(public string $messageId) {}
}
