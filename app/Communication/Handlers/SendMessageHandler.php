<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Communication\Commands\SendMessage;
use App\Communication\Contracts\MessageAddressResolver;
use App\Communication\Events\MessageSent;
use App\Communication\Exceptions\MessageBodyEmpty;
use App\Communication\Models\Message;
use App\Communication\States\Support\AnsweringMessageStateReference;
use App\Contracts\CommandHandler;
use App\Hooks\Contracts\ActorWorkStacks;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Refuses a blank body, also one a middleware made blank, resolves the session after every middleware, saves the message, asks its answer and pushes the answering state.
 */
final readonly class SendMessageHandler implements CommandHandler
{
    public function __construct(
        private MessageAddressResolver $addresses,
        private ActorWorkStacks $workStacks,
        private Dispatcher $events,
    ) {}

    public function handle(SendMessage $command): void
    {
        if (trim($command->body) === '') {
            throw MessageBodyEmpty::forSend();
        }

        $this->addresses->requireReceiver($command->recipient);
        $message = Message::write($command->body);
        $message->requireAnswerFrom($command->recipient);
        $this->workStacks->pushFor($command->recipient, AnsweringMessageStateReference::forMessage($message));
        $this->events->dispatch(new MessageSent($message->id, $command->recipient, $message->answer_round));
    }
}
