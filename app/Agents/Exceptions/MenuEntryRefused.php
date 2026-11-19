<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\MenuEntryState;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A menu library entry asked for that is not the journal owner's, or no longer in the state the caller read.
 */
final class MenuEntryRefused extends RuntimeException implements CommandRefusal
{
    public static function notFound(string $entryId): self
    {
        return new self("There is no menu entry {$entryId}.");
    }

    public static function changedSinceRead(string $entryId, MenuEntryState $expected, MenuEntryState $current): self
    {
        return new self("Menu entry {$entryId} is {$current->value}, not {$expected->value}; read it again.");
    }
}
