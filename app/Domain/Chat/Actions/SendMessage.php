<?php

declare(strict_types=1);

namespace App\Domain\Chat\Actions;

use App\Core\Hooks\Contracts\StackTransactionRunner;
use App\Core\Hooks\Contracts\UserStack;
use App\Core\Hooks\Support\StackTarget;
use App\Domain\Chat\Api\Events\MessageSent;
use App\Domain\Chat\Contracts\MessageSender;
use App\Domain\Chat\Exceptions\MessageBodyEmpty;
use App\Domain\Chat\Models\Message;
use App\Domain\Chat\States\Support\AnsweringMessageStateReference;
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
