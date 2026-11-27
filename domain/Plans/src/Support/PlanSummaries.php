<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Exceptions\RecordUnavailable;
use App\Records\Contracts\SummaryProvider;
use App\Records\Values\RecordSummary;
use App\Records\Values\SummaryLine;
use App\Records\Values\SummaryPage;
use App\Records\Values\SummaryProgress;
use App\Values\ProjectOwner;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\PlanResolver;
use Domain\Plans\Values\PlanCard;
use Illuminate\Database\Eloquent\Collection;

/**
 * Plans as a short card shows them: the title, the phase a plan is at (the first unfinished one, as every plan card
 * reads it) and how many of its tasks are done, with its page; a plan with no phases shows no progress at all. One
 * plan is read by its id, a batch in one query with the titles of their phases.
 */
final readonly class PlanSummaries implements SummaryProvider
{
    public function __construct(private PlanResolver $plans) {}

    public function requireReadable(string $id): RecordSummary
    {
        $plan = Plan::query()->whereKey($id)->firstOr(RecordUnavailable::throwing()->forModel(Plan::class, $id));

        return $this->summaries($plan->newCollection([$plan]))[0];
    }

    public function ownerOf(string $id): ProjectOwner
    {
        return Plan::query()
            ->whereKey($id)
            ->firstOr(RecordUnavailable::throwing()->forModel(Plan::class, $id))
            ->projectOwner();
    }

    public function visibleSummaries(array $ids): array
    {
        $plans = Plan::query()->whereKey($ids)->readExactlyOf($ids)->get();

        return $this->summaries($plans);
    }

    /**
     * @param  Collection<int, Plan>  $plans
     * @return list<RecordSummary>
     */
    private function summaries(Collection $plans): array
    {
        $titles = [];

        $phases = Phase::query()
            ->ofPlans($plans->modelKeys())
            ->readAll('the current phase of each summarized plan is named by its title')
            ->get(['plan_id', 'number', 'title']);

        foreach ($phases as $phase) {
            $titles["{$phase->plan_id}:{$phase->number}"] = $phase->title;
        }

        return array_map(
            fn (PlanCard $card) => self::summary($card, $titles["{$card->id}:{$card->currentPhase}"] ?? null),
            $this->plans->cardsOfPlans($plans),
        );
    }

    private static function summary(PlanCard $plan, string|null $currentPhaseTitle): RecordSummary
    {
        $page = new SummaryPage('plans.plan', 'plan', (string) $plan->number);

        if ($plan->currentPhase === null) {
            $noPhases = [new SummaryLine('phase', 'No phases yet')];

            return new RecordSummary($plan->id, $plan->title, lines: $noPhases, page: $page);
        }

        $phase = $plan->progress->isComplete()
            ? 'All phases complete'
            : $currentPhaseTitle ?? "Phase {$plan->currentPhase}";

        return new RecordSummary(
            $plan->id,
            $plan->title,
            lines: [new SummaryLine('phase', $phase)],
            progress: new SummaryProgress($plan->progress->finished, $plan->progress->total),
            page: $page,
        );
    }
}
