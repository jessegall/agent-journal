<?php

declare(strict_types=1);

namespace App\Comments\Support;

use App\Comments\Events\CommentPosted;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\DatabaseManager;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Tells listeners of a new comment once its transaction has committed. A failing listener never turns a committed
 * comment into an error: it is logged without the comment's text.
 */
final readonly class CommentEvents
{
    public function __construct(
        private Dispatcher $events,
        private DatabaseManager $database,
        private LoggerInterface $log,
    ) {}

    public function posted(CommentPosted $event): void
    {
        $this->database->afterCommit(function () use ($event): void {
            try {
                $this->events->dispatch($event);
            } catch (Throwable $failure) {
                $this->logFailure($event, $failure);
            }
        });
    }

    private function logFailure(CommentPosted $event, Throwable $failure): void
    {
        $this->log->error(
            'A listener of CommentPosted failed.',
            ['comment' => $event->commentId, 'listener_failure' => $failure::class],
        );
    }
}
