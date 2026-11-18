<?php

declare(strict_types=1);

namespace Domain\Rules\Http\Requests\Concerns;

use Domain\Rules\Data\RuleFiltersData;

/**
 * The rules list's query, shared by every page that shows it: search words up to 200 characters, a page from 1, and
 * an optional selected rule id. A page that also shows another list puts a prefix before the search and page keys.
 */
trait ReadsRuleFilters
{
    /**
     * @return array<string, list<string>>
     */
    protected function ruleFilterRules(string $keyPrefix = ''): array
    {
        return [
            "{$keyPrefix}q" => ['nullable', 'string', 'max:200'],
            "{$keyPrefix}page" => ['nullable', 'integer', 'min:1'],
            'rule' => ['nullable', 'string', 'ulid'],
        ];
    }

    /**
     * An empty search arrives as null after Laravel's empty-string conversion; it means no search words.
     */
    protected function ruleFilters(string $keyPrefix = ''): RuleFiltersData
    {
        return RuleFiltersData::from(array_filter([
            'q' => $this->string("{$keyPrefix}q")->toString(),
            'page' => $this->integer("{$keyPrefix}page", 1),
            'rule' => $this->filled('rule') ? $this->string('rule')->toString() : null,
        ], fn (mixed $value) => $value !== null));
    }
}
