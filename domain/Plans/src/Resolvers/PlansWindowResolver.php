<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Ui\Contracts\PageResolver;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Data\PlanListData;
use Domain\Plans\Data\PlanReaderData;
use Domain\Plans\Http\Requests\PlansRequest;
use Domain\Plans\Support\PlanOutline;
use Spatie\LaravelData\Optional;

/**
 * The plans window, on Home and on its own page: one page of plans by its search, with the selected plan's reader and
 * the page of its outline the reader asked for.
 */
final readonly class PlansWindowResolver implements PageResolver
{
    public function __construct(
        private PlansRequest $request,
        private PlanResolver $records,
        private PlanOutline $outline,
    ) {}

    public function read(): PlanListData
    {
        $filters = $this->request->filters();
        $planPage = $this->records->list($filters->toDomain());
        $card = $planPage->selection->card;
        $outline = $card === null
            ? Optional::create()
            : $this->outline->of($card->id, $card->currentPhase, $this->request->outlinePageAsk());

        return PlanListData::from([
            'rows' => PlanCardData::collect($planPage->cards),
            'filters' => $filters->onPage($planPage->page),
            'pagination' => [
                'page' => $planPage->page,
                'lastPage' => $planPage->lastPage,
                'total' => $planPage->total,
            ],
            'selectionMissing' => $planPage->selection->isMissing(),
            'selected' => PlanReaderData::ofSelection($planPage->selection, $outline),
        ]);
    }
}
