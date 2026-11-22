<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Str;

/**
 * The name a command goes by in logs and operations: its class name without the Command suffix, such as WriteNote
 * for App\Notes\Commands\WriteNote\WriteNoteCommand.
 */
final class CommandName
{
    public static function of(string $command): string
    {
        return Str::beforeLast(class_basename($command), 'Command');
    }
}
