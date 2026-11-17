<?php

declare(strict_types=1);

namespace App\Domain\Rules\Http\Requests;

use App\Domain\Rules\Data\RuleFiltersData;
use App\Domain\Rules\Http\Requests\Concerns\ReadsRuleFilters;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The rules page's query: search words up to 200 characters, a page from 1, and an optional selected rule id.
 */
final class RulesRequest extends FormRequest
{
    use ReadsRuleFilters;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return $this->ruleFilterRules();
    }

    public function filters(): RuleFiltersData
    {
        return $this->ruleFilters();
    }
}
