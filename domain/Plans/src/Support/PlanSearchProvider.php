<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Search\Contracts\SearchProvider;
use App\Search\Contracts\TieredSearch;
use App\Search\Enums\ScoreTier;
use App\Search\Values\AdmittedConstraints;
use App\Search\Values\RefreshCandidates;
use App\Search\Values\SearchBatch;
use App\Search\Values\SearchQuery;
use App\Search\Values\SearchResult;
use App\Search\Values\TieredSearchSource;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use Domain\Plans\Models\Plan;

/**
 * Searches plan titles through the shared bounded tiered search, a plan reference such as plan 57 first.
 */
final readonly class PlanSearchProvider implements SearchProvider
{
    public function __construct(
        private PlanSearchAccess $access,
        private PlanReferenceRecognizer $recognizer,
        private TieredSearch $titles,
    ) {}

    public function search(SearchQuery|RefreshCandidates $query): SearchBatch
    {
        $constraints = $this->access->constraints($query->reader);

        if ($constraints->recordIds->hasNoneAllowed()) {
            return SearchBatch::nothing();
        }

        return $this->titles->search($query, new TieredSearchSource(
            admitted: fn () => self::admitted($constraints),
            idColumn: 'id',
            titleColumn: 'title',
            columns: ['id', 'number', 'title'],
            titleOf: fn (Plan $plan): string => $plan->title,
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $planId) => $this->access->admitsOpen($query->reader, $planId),
            referenceOf: fn (SearchQuery $asked, TieredSearchSource $plans): SearchResult|null => $this->titles
                ->numberedReference($asked, $this->recognizer, $plans),
        ));
    }

    /**
     * @return ReadBuilder<Plan>
     */
    private static function admitted(AdmittedConstraints $constraints): ReadBuilder
    {
        $query = Plan::query();

        if ($constraints->recordIds->isRestricted()) {
            $query->whereKey($constraints->recordIds->names());
        }

        return $query;
    }

    private static function hitOf(Plan $plan, ScoreTier $tier): SearchResult
    {
        return SearchResult::shortened(
            "Plan {$plan->number} · {$plan->title}",
            $tier === ScoreTier::Reference ? "Plan {$plan->number}" : $plan->title,
            new RecordIdentity(Plan::linkType(), $plan->id),
            $tier,
        );
    }
}
