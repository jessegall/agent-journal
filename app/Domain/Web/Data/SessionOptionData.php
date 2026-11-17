<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A running agent session the user can talk to.
 */
#[TypeScript]
final class SessionOptionData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $agentName,
    ) {}
}
