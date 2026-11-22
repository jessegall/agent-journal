<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What an agent's tool does to a file: reads it, or writes, creates or deletes it.
 */
enum FileAccess: string
{
    case Read = 'read';
    case Write = 'write';
}
