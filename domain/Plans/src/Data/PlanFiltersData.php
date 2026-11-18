<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Enums\PlanStateGroup;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The accepted filters of the plans page as the browser keeps them in the query string: search words, page and the
 * selected plan's id as a ULID.
 */
#[TypeScript]
final class PlanFiltersData extends Data
{
    public function __construct(
        public readonly string $q = '',
        public readonly int $page = 1,
        #[Ulid] public readonly string|Optional $plan = new Optional,
        public readonly PlanStateGroup|Optional $state = new Optional,
    ) {}

    /**
     * The search and page may be left out, and an empty search arrives as null after Laravel's empty-string conversion;
     * both then take their defaults.
     *
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:200'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ];
    }

    /**
     * The same filters on the page the domain settled on, which may differ from the one asked for.
     */
    public function onPage(int $page): self
    {
        return self::from([...$this->toArray(), 'page' => $page]);
    }

    /**
     * The filters as the plans page's query string: no empty search, no first page.
     *
     * @return array<string, mixed>
     */
    public function toQuery(): array
    {
        return array_filter($this->toArray(), fn (mixed $value) => $value !== '' && $value !== 1);
    }

    public function toDomain(): PlanFilters
    {
        return new PlanFilters(
            $this->q,
            $this->page,
            $this->plan instanceof Optional ? null : (string) $this->plan,
            $this->state instanceof Optional ? [] : $this->state->states(),
        );
    }
}
