<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Plans\Api\PlanList;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a plans list stands: the page shown, the last page and how many plans match.
 *
 * @method static static from(PlanList|array<string, mixed> $payload)
 */
#[TypeScript]
final class PlanPaginationData extends Data
{
    public function __construct(
        public readonly int $page,
        public readonly int $lastPage,
        public readonly int $total,
    ) {}

    public static function fromPlanList(PlanList $planPage): self
    {
        return self::from(['page' => $planPage->page, 'lastPage' => $planPage->lastPage, 'total' => $planPage->total]);
    }
}
