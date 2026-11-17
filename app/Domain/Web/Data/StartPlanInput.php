<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the start form posts: the filters to return to afterwards. Built from the request, so it is validated.
 */
#[TypeScript]
final class StartPlanInput extends Data
{
    public function __construct(public readonly PlanFiltersData $filters = new PlanFiltersData) {}
}
