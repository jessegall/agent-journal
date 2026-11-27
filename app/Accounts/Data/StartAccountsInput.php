<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The agent a start form starts and the driver family chosen in it, whose accounts the form offers.
 */
#[TypeScript]
final class StartAccountsInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $agent,
        #[Max(32)]
        public readonly string $family,
    ) {}
}
