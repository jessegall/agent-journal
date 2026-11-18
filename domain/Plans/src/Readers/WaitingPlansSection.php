<?php

declare(strict_types=1);

namespace Domain\Plans\Readers;

use App\Agents\Contracts\SessionReader;
use App\Ui\Contracts\SectionReader;
use App\Ui\Declarations\SlotContext;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Contracts\PlanReader;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Data\PlanListData;
use Domain\Plans\Data\PlanPaginationData;
use Domain\Plans\Enums\PlanStateGroup;

/**
 * The plans waiting for review, in Chat's dock beside the chosen agent session; the session is checked again here,
 * so a session the user may not talk to shows nothing.
 */
final readonly class WaitingPlansSection implements SectionReader
{
    public function __construct(
        private SessionReader $sessions,
        private PlanReader $records,
    ) {}

    public function read(SlotContext $context): PlanListData
    {
        $this->sessions->requireActive((string) $context->id);
        $filters = new PlanFilters(states: PlanStateGroup::Waiting->states());
        $list = $this->records->list($filters);

        return PlanListData::from([
            'rows' => PlanCardData::collect($list->cards),
            'filters' => ['q' => '', 'page' => $list->page, 'state' => PlanStateGroup::Waiting],
            'pagination' => PlanPaginationData::fromPlanList($list),
            'selectionMissing' => false,
        ]);
    }
}
