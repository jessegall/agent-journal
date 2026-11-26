<?php

declare(strict_types=1);

namespace App\Values;

use App\Access\Contracts\AuthoritySource;

/**
 * A signed-in user admitted to inboxes but not the owner: it may use the inboxes it is in and nothing else of the journal.
 */
final readonly class InboxMemberAuthority implements AuthoritySource
{
    public function __construct(public string $entry) {}

    public function description(): string
    {
        return "an inbox member admitted through {$this->entry}";
    }

    public function mayRunApplicationCommands(): bool
    {
        return false;
    }
}
