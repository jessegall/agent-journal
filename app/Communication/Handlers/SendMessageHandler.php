<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Agents\Contracts\SessionReader;
use App\Communication\Commands\SendMessage;
use App\Communication\Events\MessageSent;
use App\Communication\Exceptions\MessageBodyEmpty;
use App\Communication\Models\Message;
use App\Communication\States\Support\AnsweringMessageStateReference;
use App\Contracts\CommandHandler;
use App\Hooks\Contracts\UserStack;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Refuses a blank body, also one a middleware made blank, resolves the session after every middleware, saves the message, asks its answer and pushes the answering state.
 */
final readonly class SendMessageHandler implements CommandHandler
{
    public function __construct(
        private SessionReader $sessions,
        private UserStack $stacks,
        private Dispatcher $events,
    ) {}

    public function handle(SendMessage $command): void
    {
        if (trim($command->body) === '') {
            throw MessageBodyEmpty::forSend();
        }

        $target = $this->sessions->requireActive($command->sessionId);
        $message = Message::write($command->body);
        $message->requireAnswerFrom($target);
        $this->stacks->push($target, AnsweringMessageStateReference::forMessage($message));
        $this->events->dispatch(new MessageSent($message->id, $target));
    }
}
