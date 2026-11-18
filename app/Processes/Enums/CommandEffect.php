<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * What a command part does to files, as the parser knows it.
 */
enum CommandEffect: string
{
    case ReadsOnly = 'reads_only';
    case ChangesFiles = 'changes_files';
    case Unknown = 'unknown';

    public function mayChangeFiles(): bool
    {
        return $this !== self::ReadsOnly;
    }
}
