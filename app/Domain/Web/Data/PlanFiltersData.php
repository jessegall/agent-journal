<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Plans\PlanFilters;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The accepted filters of the plans page as the browser keeps them in the query string: search words, page and the
 * selected plan's id as a decimal string.
 */
#[TypeScript]
final class PlanFiltersData extends Data
{
    public function __construct(
        public readonly string $q = '',
        public readonly int $page = 1,
        public readonly string|Optional $plan = new Optional,
    ) {}

    /**
     * The same filters on the page the domain settled on, which may differ from the one asked for.
     */
    public function onPage(int $page): self
    {
        return self::from([...$this->toArray(), 'page' => $page]);
    }

    public function toDomain(): PlanFilters
    {
        return new PlanFilters($this->q, $this->page, $this->plan instanceof Optional ? null : (int) $this->plan);
    }
}
