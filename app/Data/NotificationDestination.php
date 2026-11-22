<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a notification leads: its target's key and id, and the address the server resolved for it.
 */
#[TypeScript]
final class NotificationDestination extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $id,
        public readonly string $url,
    ) {}
}
