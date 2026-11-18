<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Whether a journal command route only reads the journal or changes it.
 */
enum JournalRouteType: string
{
    case Read = 'read';
    case Write = 'write';

    /**
     * @return list<CommandClass>
     */
    public function classes(): array
    {
        return match ($this) {
            self::Read => [CommandClass::JournalOperation, CommandClass::Read],
            self::Write => [CommandClass::JournalOperation],
        };
    }
}
