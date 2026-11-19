<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Agents\Contracts\SessionResolver;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Events\MessageNeedsAnswer;
use App\Communication\Models\Message;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Resolves the session after every middleware, then asks its agent for the answer under the message's row lock.
 */
final readonly class RequireMessageAnswerHandler implements CommandHandler
{
    public function __construct(
        private SessionResolver $sessions,
        private Dispatcher $events,
    ) {}

    public function handle(RequireMessageAnswer $command): void
    {
        $target = $this->sessions->requireActive($command->sessionId);

        Message::lockedById($command->messageId)->requireAnswerFrom($target);
        $this->events->dispatch(new MessageNeedsAnswer($command->messageId, $target));
    }
}
