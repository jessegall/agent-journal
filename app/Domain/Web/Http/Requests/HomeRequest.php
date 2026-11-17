<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Requests;

use App\Domain\Web\Data\HomeFiltersData;
use App\Domain\Web\Http\Requests\Concerns\ReadsPlanFilters;
use App\Domain\Web\Http\Requests\Concerns\ReadsRuleFilters;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Home's query: the plans window's filters, the rules window's filters under the prefix rules_, and the agent session
 * the chat window talks to.
 */
final class HomeRequest extends FormRequest
{
    use ReadsPlanFilters;
    use ReadsRuleFilters;

    public const string RULES_KEY_PREFIX = 'rules_';

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            ...$this->planFilterRules(),
            ...$this->ruleFilterRules(self::RULES_KEY_PREFIX),
            'session' => ['nullable', 'string', 'regex:/^[1-9][0-9]{0,18}$/'],
        ];
    }

    public function filters(): HomeFiltersData
    {
        return HomeFiltersData::from(array_filter([
            'plans' => $this->planFilters(),
            'rules' => $this->ruleFilters(self::RULES_KEY_PREFIX),
            'session' => $this->filled('session') ? $this->string('session')->toString() : null,
        ], fn (mixed $value) => $value !== null));
    }
}
