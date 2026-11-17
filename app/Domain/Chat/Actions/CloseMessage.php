<?php

declare(strict_types=1);

namespace App\Domain\Chat\Actions;

use App\Domain\Chat\Events\MessageAnswered;
use App\Domain\Chat\Events\MessageDismissed;
use App\Domain\Chat\Models\Message;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;

/**
 * Ends a message's wait for an answer, answered or dismissed, and tells listeners once that has committed.
 */
final readonly class CloseMessage
{
    public function __construct(
        private ConnectionInterface $database,
        private Dispatcher $events,
    ) {}

    public function answer(Message $message): void
    {
        $this->database->transaction(function () use ($message): void {
            $message->markAnswered();
            $this->events->dispatch(new MessageAnswered($message->id));
        });
    }

    public function dismiss(Message $message): void
    {
        $this->database->transaction(function () use ($message): void {
            $message->dismiss();
            $this->events->dispatch(new MessageDismissed($message->id));
        });
    }
}
