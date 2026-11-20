<?php

declare(strict_types=1);

namespace App\Communication\Listeners;

use App\Agents\Models\AgentSession;
use App\Agents\Events\SessionOpened;
use App\Communication\Models\Message;
use App\Contracts\Listener;

/**
 * Captures a launch's authorized message source in the session transaction.
 */
final readonly class CaptureJobMessageSource implements Listener
{
    public function handle(SessionOpened $event): void
    {
        if ($event->authorizedSource?->type !== Message::LINK_TYPE) {
            return;
        }

        AgentSession::captureJobSourceMessage($event->sessionId, $event->authorizedSource->id);
    }
}
