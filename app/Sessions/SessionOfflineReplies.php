<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Models\Agents\AgentSession;
use App\Sessions\Contracts\ProfileResolver;
use App\Sessions\Enums\OfflineReplyMode;
use App\Values\ProfileKey;

/**
 * How a session's hooks are answered while the journal is away, as the profile revision it was pinned to decides.
 */
final readonly class SessionOfflineReplies
{
    public function __construct(private ProfileResolver $profiles) {}

    public function of(string $sessionId): OfflineReplyMode
    {
        $session = AgentSession::findById($sessionId);

        return $this->profiles
            ->admittedPin(ProfileKey::from($session->profile_key), $session->profile_revision)
            ->base
            ->offlineReply();
    }
}
