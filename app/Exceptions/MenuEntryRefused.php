<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Enums\Navigation\MenuEntryStatus;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * A menu library entry asked for that is not the journal owner's, or no longer in the state the caller read.
 */
final class MenuEntryRefused extends RuntimeException implements CommandRefusal
{
    /**
     * @use ThrowsLater<MenuEntryRefused>
     */
    use ThrowsLater;

    public static function notFound(string $entryId): self
    {
        return new self("There is no menu entry {$entryId}.");
    }

    public static function changedSinceRead(string $entryId, MenuEntryStatus $expected, MenuEntryStatus $current): self
    {
        return new self("Menu entry {$entryId} is {$current->value}, not {$expected->value}; read it again.");
    }
}
