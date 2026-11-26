<?php

declare(strict_types=1);

namespace Domain\Rules\Support;

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
use Domain\Rules\Models\Rule;

/**
 * Searches rule texts through the shared bounded tiered search, a rule reference such as rule 34 first. A rule has
 * no title, so its text stands in the title tiers and its number titles the hit.
 */
final readonly class RuleSearchProvider implements SearchProvider
{
    public function __construct(
        private RuleSearchAccess $access,
        private RuleReferenceRecognizer $recognizer,
        private TieredSearch $texts,
    ) {}

    public function search(SearchQuery|RefreshCandidates $query): SearchBatch
    {
        $constraints = $this->access->constraints($query->reader);

        if ($constraints->recordIds->hasNoneAllowed()) {
            return SearchBatch::nothing();
        }

        return $this->texts->search($query, new TieredSearchSource(
            admitted: fn () => self::admitted($constraints),
            idColumn: 'id',
            titleColumn: 'text',
            columns: ['id', 'number', 'text'],
            titleOf: fn (Rule $rule): string => $rule->text,
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $ruleId) => $this->access->admitsOpen($query->reader, $ruleId),
            referenceOf: fn (SearchQuery $asked, TieredSearchSource $rules): SearchResult|null => $this->texts
                ->numberedReference($asked, $this->recognizer, $rules),
        ));
    }

    /**
     * @return ReadBuilder<Rule>
     */
    private static function admitted(AdmittedConstraints $constraints): ReadBuilder
    {
        $query = Rule::query();

        if ($constraints->recordIds->isRestricted()) {
            $query->whereKey($constraints->recordIds->names());
        }

        return $query;
    }

    private static function hitOf(Rule $rule, ScoreTier $tier): SearchResult
    {
        return SearchResult::shortened(
            "Rule {$rule->number}",
            $rule->text,
            new RecordIdentity(Rule::linkType(), $rule->id),
            $tier,
        );
    }
}
