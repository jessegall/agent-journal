<?php

declare(strict_types=1);

namespace App\Enums\Navigation;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a menu library entry stands: current while it is replayed, or superseded by a newer proven entry.
 */
#[TypeScript]
enum MenuEntryStatus: string
{
    case Current = 'current';
    case Superseded = 'superseded';

    public function isUsable(): bool
    {
        return $this === self::Current;
    }
}
