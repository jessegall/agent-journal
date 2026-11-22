<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\SessionOpened;
use App\Models\AgentSession;
use App\Models\Message;

/**
 * Captures a launch's authorized message source in the session transaction.
 */
#[InCommandTransaction]
final readonly class CaptureJobMessageSource implements Listener
{
    public function handle(SessionOpened $event): void
    {
        if ($event->authorizedSource?->type !== Message::LINK_TYPE) {
            return;
        }

        $this->captureJobSourceMessage($event->sessionId, $event->authorizedSource->id);
    }

    private function captureJobSourceMessage(string $sessionId, string $messageId): void
    {
        AgentSession::query()->whereKey($sessionId)->whereNull('job_source_message_id')->update([
            'job_source_message_id' => $messageId,
        ]);
    }
}
