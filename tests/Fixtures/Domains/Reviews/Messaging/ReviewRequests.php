<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\Messaging;

use App\Bus\Contracts\CommandBus;
use App\Messages\Commands\SendMessage\SendMessageCommand;

/**
 * A domain posting a review request through Core alone: Core's send command to an inbox the actor is attached to,
 * with no Chat type.
 */
final readonly class ReviewRequests
{
    public function __construct(private CommandBus $commands) {}

    /**
     * Posts a review request to an inbox the current actor is attached to; returns the message id.
     */
    public function post(string $inboxId, string $request): string
    {
        return $this->commands->run(new SendMessageCommand($inboxId, $request));
    }
}
