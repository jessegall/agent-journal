<?php

declare(strict_types=1);

namespace Domain\Documents\Listeners;

use App\Agents\Events\SessionClosed;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Listener;
use Domain\Documents\Commands\CloseEndedDraft;

/**
 * Closes the draft an agent held in a session that ended (an author holds one draft at a time), inside the transaction
 * that ends it: a changed draft
 * becomes the next revision under that agent, an unchanged one leaves none. A failure here rolls the ending back.
 */
final readonly class CloseEndedSessionDraft implements Listener
{
    public function __construct(private CommandBus $commands) {}

    public function handle(SessionClosed $event): void
    {
        $this->commands->run(new CloseEndedDraft($event));
    }
}
