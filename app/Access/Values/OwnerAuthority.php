<?php

declare(strict_types=1);

namespace App\Access\Values;

use App\Access\Contracts\AuthoritySource;

/**
 * The authority of a user the journal's access policy admitted as an owner of this journal.
 */
final readonly class OwnerAuthority implements AuthoritySource
{
    public function __construct(public string $entry) {}

    public function description(): string
    {
        return "an owner admitted through {$this->entry}";
    }

    public function mayRunApplicationCommands(): bool
    {
        return true;
    }
}
