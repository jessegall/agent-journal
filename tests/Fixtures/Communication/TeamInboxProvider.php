<?php

declare(strict_types=1);

namespace Tests\Fixtures\Communication;

use App\Contracts\Inboxes\LabeledInbox;
use App\Contracts\Inboxes\InboxProvider;

/**
 * A second kind of inbox for the registration tests: a team that owns its own label.
 */
final readonly class TeamInboxProvider implements InboxProvider
{
    public function inboxFor(string $inboxId, string $providerId): LabeledInbox
    {
        return new TeamInbox($inboxId);
    }
}
