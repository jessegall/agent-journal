<?php

declare(strict_types=1);

namespace Domain\Chat\Actions;

use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\StackTransactionRunner;
use App\Hooks\Contracts\UserStack;
use Domain\Chat\Api\Events\MessageSent;
use Domain\Chat\Contracts\MessageSender;
use Domain\Chat\Exceptions\MessageBodyEmpty;
use Domain\Chat\Models\Message;
use Domain\Chat\States\Support\AnsweringMessageStateReference;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * A user sends a message to a running agent's session: the message, the request for its answer and the answering
 * state on that agent's stack commit together, so a refused target leaves no message behind. The body is kept byte for
 * byte. An agent asking for an answer keeps using RequireMessageAnswer.
 */
#[Scoped]
final readonly class SendMessage implements MessageSender
{
    public function __construct(
        private StackTransactionRunner $transaction,
        private UserStack $stacks,
        private Dispatcher $events,
    ) {}

    public function send(string $body, StackTarget $target): void
    {
        if (trim($body) === '') {
            throw MessageBodyEmpty::forSend();
        }

        $this->transaction->run(function () use ($body, $target): void {
            $message = Message::query()->create(['body' => $body]);
            $message->requireAnswerFrom($target);
            $this->stacks->push($target, AnsweringMessageStateReference::forMessage($message));

            $this->events->dispatch(new MessageSent($message->id, $target));
        });
    }
}
