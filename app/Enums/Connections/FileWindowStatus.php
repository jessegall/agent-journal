<?php

declare(strict_types=1);

namespace App\Enums\Connections;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a File window stands: no file chosen, the file read, waiting for the host, a read that failed, the project's
 * machine offline, a binary file, a file too large to show whole, or no project connected.
 */
#[TypeScript]
enum FileWindowStatus: string
{
    case Empty = 'empty';
    case Ready = 'ready';
    case Pending = 'pending';
    case Failed = 'failed';
    case Offline = 'offline';
    case Binary = 'binary';
    case TooLarge = 'too_large';
    case None = 'none';
}
