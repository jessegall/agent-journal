<?php

declare(strict_types=1);

namespace Domain\Rules\Resolvers;

use App\Ui\Contracts\PageResolver;
use Domain\Rules\Contracts\RuleResolver;
use Domain\Rules\Data\RuleListData;
use Domain\Rules\Data\RulePaginationData;
use Domain\Rules\Data\RuleReaderData;
use Domain\Rules\Data\RuleRowData;
use Domain\Rules\Http\Requests\RulesRequest;
use Spatie\LaravelData\Optional;

/**
 * The rules window, on Home and on its own page: one page of rules by its search, with the selected rule's reader.
 */
final readonly class RulesWindowResolver implements PageResolver
{
    public function __construct(
        private RulesRequest $request,
        private RuleResolver $records,
    ) {}

    public function read(): RuleListData
    {
        $filters = $this->request->filters();
        $rulePage = $this->records->list($filters->toDomain());

        return RuleListData::from([
            'rows' => RuleRowData::collect($rulePage->rules),
            'filters' => $filters->onPage($rulePage->page),
            'pagination' => RulePaginationData::fromRuleList($rulePage),
            'selectionMissing' => $rulePage->selectionMissing,
            'selected' => $rulePage->selection()->map(RuleReaderData::from(...))->getOrElse(Optional::create()),
        ]);
    }
}
