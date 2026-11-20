<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Agents\Contracts\SessionResolver;
use App\Ui\Contracts\SectionResolver;
use App\Ui\Declarations\SlotContext;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Data\PlanListData;
use Domain\Plans\Data\PlanPaginationData;
use Domain\Plans\Enums\PlanStateGroup;

/**
 * The plans waiting for review, in Chat's dock beside the chosen agent session; the session is checked again here,
 * so a session the user may not talk to shows nothing.
 */
final readonly class WaitingPlansSection implements SectionResolver
{
    public function __construct(
        private SessionResolver $sessions,
        private PlanResolver $records,
    ) {}

    public function read(SlotContext $context): PlanListData
    {
        $this->sessions->requireActive((string) $context->id);
        $filters = new PlanFilters(states: PlanStateGroup::Waiting->states());
        $planPage = $this->records->list($filters);

        return PlanListData::from([
            'rows' => PlanCardData::collect($planPage->cards),
            'filters' => ['q' => '', 'page' => $planPage->page, 'state' => PlanStateGroup::Waiting],
            'pagination' => PlanPaginationData::fromPlanList($planPage),
            'selectionMissing' => false,
        ]);
    }
}
