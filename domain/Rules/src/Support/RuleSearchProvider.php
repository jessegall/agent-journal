<?php

declare(strict_types=1);

namespace Domain\Rules\Support;

use App\Contracts\SearchProvider;
use App\Enums\ScoreTier;
use App\Support\RecordIdentity;
use App\Support\TieredRecordSearch;
use App\Values\AdmittedConstraints;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchResult;
use App\Values\TieredSearchSource;
use Domain\Rules\Models\Rule;
use Illuminate\Database\Eloquent\Builder;

/**
 * Searches rule texts through the shared bounded tiered search, a rule reference such as rule 34 first. A rule has
 * no title, so its text stands in the title tiers and its number titles the hit.
 */
final readonly class RuleSearchProvider implements SearchProvider
{
    public const string RECORD_TYPE = 'rules.rule';

    public function __construct(
        private RuleSearchAccess $access,
        private RuleReferenceRecognizer $recognizer,
        private TieredRecordSearch $texts,
    ) {}

    public function search(SearchQuery $query): SearchBatch
    {
        $constraints = $this->access->constraints($query->reader);

        if ($constraints->recordIds->admitsNone()) {
            return SearchBatch::exhausted('', []);
        }

        return $this->texts->search($query, new TieredSearchSource(
            admitted: fn () => self::admitted($constraints),
            idColumn: 'id',
            titleColumn: 'text',
            columns: ['id', 'number', 'text'],
            titleOf: fn (Rule $rule): string => $rule->text,
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $ruleId): bool => $this->access->admitsOpen($query->reader, $ruleId),
            referenceOf: fn (SearchQuery $asked, TieredSearchSource $rules): SearchResult|null => $this->texts
                ->numberedReference($asked, $this->recognizer, $rules),
        ));
    }

    /**
     * @return Builder<Rule>
     */
    private static function admitted(AdmittedConstraints $constraints): Builder
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
            new RecordIdentity(self::RECORD_TYPE, $rule->id),
            $tier,
        );
    }
}
