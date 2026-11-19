<?php

declare(strict_types=1);

namespace App\Profiles\Listeners;

use App\Agents\Events\LaunchGrantRequested;
use App\Agents\Models\AgentSession;
use App\Contracts\Listener;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Values\ProfileKey;

/**
 * Puts in the launch grant how the launch's relay answers while the journal is unreachable, as its pinned profile's
 * type declares; a launch whose session is gone keeps the refusing default.
 */
final readonly class GrantOfflineReply implements Listener
{
    public function __construct(private ProfileResolver $profiles) {}

    public function handle(LaunchGrantRequested $event): void
    {
        $session = AgentSession::query()->find($event->sessionId);

        if ($session === null) {
            return;
        }

        $profile = $this->profiles->admittedPin(ProfileKey::from($session->profile_key), $session->profile_revision);
        $event->additions->grantOfflineReply($profile->type->offlineReply());
    }
}
