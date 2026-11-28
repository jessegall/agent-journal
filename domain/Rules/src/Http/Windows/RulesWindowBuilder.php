<?php

declare(strict_types=1);

namespace Domain\Rules\Http\Windows;

use App\Reads\PageFormRequests;
use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use App\Web\Values\PaneExcerpt;
use Domain\Rules\Contracts\RuleResolver;
use Domain\Rules\Data\RulesPaneData;
use Domain\Rules\Http\Requests\RulesRequest;
use Domain\Rules\Models\Rule;
use Illuminate\Http\Request;

final readonly class RulesWindowBuilder implements WindowBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private SurfaceAttributeMap $policies,
        private RuleResolver $rules,
    ) {}

    public function build(Request $visit): RulesPaneData
    {
        $filters = $this->requests->from(RulesRequest::class, $visit)->filters();
        $policy = $this->policies->forType(RulesPaneData::class);
        $rules = $this->rules->preview($filters->toDomain(), $policy->limitFor('items'));

        $items = $rules->map(fn (Rule $rule) => LayoutRowData::build()
            ->key($rule->id)
            ->label(PaneExcerpt::of($rule->text))
            ->value("Rule {$rule->number}")
            ->finish())->values()->all();

        $query = $filters->search === '' ? [] : ['q' => $filters->search];

        return RulesPaneData::build()
            ->items($items)
            ->fullUrl(route('rules.list', $query, false))
            ->finish();
    }
}
