<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Agents\Contracts\SessionReader;
use Domain\Chat\Commands\RequireMessageAnswer;
use Domain\Chat\Events\MessageNeedsAnswer;
use Domain\Chat\Models\Message;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Resolves the session after every middleware, then asks its agent for the answer under the message's row lock.
 */
final readonly class RequireMessageAnswerHandler
{
    public function __construct(
        private SessionReader $sessions,
        private Dispatcher $events,
    ) {}

    public function handle(RequireMessageAnswer $command): void
    {
        $target = $this->sessions->requireActive($command->sessionId);

        Message::lockedById($command->messageId)->requireAnswerFrom($target);
        $this->events->dispatch(new MessageNeedsAnswer($command->messageId, $target));
    }
}
