<?php

declare(strict_types=1);

namespace App\Domain\Plans\Data;

use App\Domain\Plans\Api\PlanList;
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

    public static function fromPlanList(PlanList $list): self
    {
        return self::from(['page' => $list->page, 'lastPage' => $list->lastPage, 'total' => $list->total]);
    }
}
