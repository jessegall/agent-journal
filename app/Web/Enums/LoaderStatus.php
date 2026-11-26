<?php

declare(strict_types=1);

namespace App\Web\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How a loader call ended: answered, refused for its input with errors by field, or unavailable to this viewer, which
 * is said the same way whatever the reason.
 */
#[TypeScript]
enum LoaderStatus: string
{
    case Ok = 'ok';
    case Invalid = 'invalid';
    case Unavailable = 'unavailable';
}
