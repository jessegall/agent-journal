<?php

declare(strict_types=1);

namespace App\Connections\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a connected project folder stands: waiting for its relay's first report, ready, offline since its presence
 * expired, on a release the server cannot speak with, or revoked.
 */
#[TypeScript]
enum BindingReadiness: string
{
    case Pending = 'pending';
    case Ready = 'ready';
    case Offline = 'offline';
    case Incompatible = 'incompatible';
    case Revoked = 'revoked';
}
