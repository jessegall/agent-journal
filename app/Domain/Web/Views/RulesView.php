<?php

declare(strict_types=1);

namespace App\Domain\Web\Views;

use App\Domain\Rules\Contracts\RuleReader;
use App\Domain\Web\Data\PaginationData;
use App\Domain\Web\Data\RuleFiltersData;
use App\Domain\Web\Data\RuleListData;
use App\Domain\Web\Data\RuleReaderData;
use App\Domain\Web\Data\RuleRowData;

/**
 * Shapes the rules the Rules domain reads into the page's slice; it neither queries tables nor restates who may review.
 */
final readonly class RulesView
{
    public function __construct(private RuleReader $records) {}

    public function rules(RuleFiltersData $filters): RuleListData
    {
        $list = $this->records->list($filters->toDomain());

        return RuleListData::from([
            'rows' => RuleRowData::collect($list->rules),
            'filters' => $filters->onPage($list->page),
            'pagination' => PaginationData::fromRuleList($list),
            'selectionMissing' => $list->selectionMissing,
            'selected' => RuleReaderData::optionalOrMissing($list->selected),
        ]);
    }
}
