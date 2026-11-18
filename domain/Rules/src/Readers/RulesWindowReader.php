<?php

declare(strict_types=1);

namespace Domain\Rules\Readers;

use App\Ui\Contracts\PageReader;
use Domain\Rules\Contracts\RuleReader;
use Domain\Rules\Data\RuleListData;
use Domain\Rules\Data\RulePaginationData;
use Domain\Rules\Data\RuleReaderData;
use Domain\Rules\Data\RuleRowData;
use Domain\Rules\Http\Requests\RulesRequest;
use Spatie\LaravelData\Optional;

/**
 * The rules window, on Home and on its own page: one page of rules by its search, with the selected rule's reader.
 */
final readonly class RulesWindowReader implements PageReader
{
    public function __construct(
        private RulesRequest $request,
        private RuleReader $records,
    ) {}

    public function read(): RuleListData
    {
        $filters = $this->request->filters();
        $list = $this->records->list($filters->toDomain());

        return RuleListData::from([
            'rows' => RuleRowData::collect($list->rules),
            'filters' => $filters->onPage($list->page),
            'pagination' => RulePaginationData::fromRuleList($list),
            'selectionMissing' => $list->selectionMissing,
            'selected' => $list->selection()->map(RuleReaderData::from(...))->getOrElse(Optional::create()),
        ]);
    }
}
