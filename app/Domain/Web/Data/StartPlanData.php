<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Web\Data\Concerns\OptionalOrMissing;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Present when Plans currently offers the start; it is not permission for the POST, which checks again.
 */
#[TypeScript]
final class StartPlanData extends Data
{
    use OptionalOrMissing;

    public function __construct(public readonly string $planId) {}
}
