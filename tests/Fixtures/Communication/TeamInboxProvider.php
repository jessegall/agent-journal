<?php

declare(strict_types=1);

namespace Tests\Fixtures\Communication;

use App\Contracts\Chat\Inbox;
use App\Contracts\Chat\InboxProvider;

/**
 * A second kind of inbox for the registration tests: a team that owns its own label.
 */
final readonly class TeamInboxProvider implements InboxProvider
{
    public function inboxFor(string $inboxId, string $providerId): Inbox
    {
        return new TeamInbox($inboxId, "Team {$providerId}");
    }
}
