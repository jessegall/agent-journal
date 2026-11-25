<?php

declare(strict_types=1);

namespace App\Enums\Navigation;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a menu library entry stands: current while it is replayed, superseded by a newer proven entry, or retired by
 * its owner.
 */
#[TypeScript]
enum MenuEntryStatus: string
{
    case Current = 'current';
    case Superseded = 'superseded';
    case Retired = 'retired';

    public function isUsable(): bool
    {
        return $this === self::Current;
    }
}
