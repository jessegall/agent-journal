<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Requests\Concerns;

use App\Domain\Plans\Data\PlanFiltersData;
use App\Domain\Plans\Enums\PlanStateGroup;
use Illuminate\Validation\Rule;

/**
 * The plans slice's query, shared by every page that shows it: search words up to 200 characters, a page from 1, and
 * an optional selected plan id.
 */
trait ReadsPlanFilters
{
    /**
     * @return array<string, list<mixed>>
     */
    protected function planFilterRules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:200'],
            'page' => ['nullable', 'integer', 'min:1'],
            'plan' => ['nullable', 'string', 'regex:/^[1-9][0-9]{0,18}$/'],
            'state' => ['nullable', Rule::enum(PlanStateGroup::class)],
        ];
    }

    /**
     * An empty search arrives as null after Laravel's empty-string conversion; it means no search words.
     */
    protected function planFilters(): PlanFiltersData
    {
        return PlanFiltersData::from(array_filter([
            'q' => $this->string('q')->toString(),
            'page' => $this->integer('page', 1),
            'plan' => $this->filled('plan') ? $this->string('plan')->toString() : null,
            'state' => $this->enum('state', PlanStateGroup::class),
        ], fn (mixed $value) => $value !== null));
    }
}
