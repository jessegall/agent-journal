<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\CurrentSession;
use App\Contracts\RequestSource;
use App\Models\AgentSession;
use App\Models\Message;

/**
 * Resolves the calling session's selected message while it remains visible.
 */
final readonly class SelectedMessages implements RequestSource
{
    public function __construct(private CurrentSession $session) {}

    public function selectedSource(): RecordIdentity|null
    {
        if (! $this->session->hasSession()) {
            return null;
        }

        $messageId = AgentSession::selectedMessage($this->session->sessionId());

        if ($messageId === null || ! Message::query()->whereKey($messageId)->exists()) {
            return null;
        }

        return new RecordIdentity(Message::LINK_TYPE, $messageId);
    }
}
