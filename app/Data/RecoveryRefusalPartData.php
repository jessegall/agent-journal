<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of the notice that shows a refused recovery above the runtimes: the error key the refusal comes back
 * under.
 */
#[TypeScript]
final class RecoveryRefusalPartData extends Data
{
    public function __construct(public readonly string $errorKey) {}
}
