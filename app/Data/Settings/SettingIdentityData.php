<?php

declare(strict_types=1);

namespace App\Data\Settings;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a setting or group lives: its owner, its key there, and both joined as owner.key for display only.
 */
#[TypeScript]
final class SettingIdentityData extends Data
{
    public function __construct(
        public readonly string $owner,
        public readonly string $key,
        public readonly string $canonicalKey,
    ) {}
}
