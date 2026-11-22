<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Authorization\AuthoritySource;

/**
 * A signed-in user admitted to chats but not the owner: it may use the chats it is in and nothing else of the journal.
 */
final readonly class ChatMemberAuthority implements AuthoritySource
{
    public function __construct(public string $entry) {}

    public function description(): string
    {
        return "a chat member admitted through {$this->entry}";
    }

    public function mayRunApplicationCommands(): bool
    {
        return false;
    }
}
