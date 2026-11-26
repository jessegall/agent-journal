<?php

declare(strict_types=1);

namespace App\Projects\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where the Project window stands: the tree read, waiting for the host, the host could not read the project, the
 * project's machine is offline, or no project is connected.
 */
#[TypeScript]
enum ProjectWindowStatus: string
{
    case Ready = 'ready';
    case Pending = 'pending';
    case Failed = 'failed';
    case Offline = 'offline';
    case None = 'none';
}
