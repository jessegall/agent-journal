<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\SendMessage;
use App\Communication\Contracts\Inbox;

/**
 * Sends a notice from one inbox to another through the one send path, under the caller's request key.
 */
final readonly class InboxNotices
{
    public function __construct(private CommandBus $commands) {}

    public function send(Inbox $source, Inbox $destination, string $body): string
    {
        return $this->commands->run(new SendMessage($source->inboxId(), $destination->inboxId(), $body));
    }
}
