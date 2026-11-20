<?php

declare(strict_types=1);

namespace App\Communication\Listeners;

use App\Agents\Events\SessionOpened;
use App\Agents\Models\JobMessageSource;
use App\Communication\Models\Message;
use App\Contracts\Listener;

/** Captures a launch's authorized message source in the session transaction. */
final readonly class CaptureJobMessageSource implements Listener
{
    public function handle(SessionOpened $event): void
    {
        if ($event->authorizedSource?->type !== Message::LINK_TYPE) {
            return;
        }

        JobMessageSource::capture($event->sessionId, $event->authorizedSource->id);
    }
}
