<?php

declare(strict_types=1);

namespace App\Domain\Chat\Actions;

use App\Core\Hooks\PersonStacks;
use App\Core\Hooks\StackTransaction;
use App\Core\Hooks\Storage\StackTarget;
use App\Domain\Chat\AnsweringMessageReference;
use App\Domain\Chat\Events\MessageSent;
use App\Domain\Chat\Exceptions\MessageBodyEmpty;
use App\Domain\Chat\Models\Message;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * A person sends a message to a running agent's session: the message, the request for its answer and the answering
 * state on that agent's stack commit together, so a refused target leaves no message behind. The body is kept byte for
 * byte. An agent asking for an answer keeps using RequireMessageAnswer.
 */
final readonly class SendMessage
{
    public function __construct(
        private StackTransaction $transaction,
        private PersonStacks $stacks,
        private Dispatcher $events,
    ) {}

    public function send(string $body, StackTarget $target): Message
    {
        if (trim($body) === '') {
            throw MessageBodyEmpty::forSend();
        }

        return $this->transaction->run(function () use ($body, $target): Message {
            $message = Message::query()->create(['body' => $body]);
            $message->requireAnswerFrom($target);
            $this->stacks->push($target, AnsweringMessageReference::forMessage($message));

            $this->events->dispatch(new MessageSent($message->id, $target));

            return $message;
        });
    }
}
