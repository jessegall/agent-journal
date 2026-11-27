<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Search\Contracts\SearchProvider;
use App\Search\Contracts\TieredSearch;
use App\Search\Enums\ScoreTier;
use App\Search\Values\AdmittedConstraints;
use App\Search\Values\BodyMatch;
use App\Search\Values\HitIdentity;
use App\Search\Values\RefreshCandidates;
use App\Search\Values\SearchableBody;
use App\Search\Values\SearchBatch;
use App\Search\Values\SearchQuery;
use App\Search\Values\SearchResult;
use App\Search\Values\SearchWords;
use App\Search\Values\TieredSearchSource;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use Domain\Documents\Models\Report;
use Domain\Documents\Values\PublicationPassage;

/**
 * Searches reports through the shared bounded tiered search: a reference such as report 351 first, then the title,
 * then the body, whose hits name the line they were found at.
 */
final readonly class ReportSearchProvider implements SearchProvider
{
    private const int SNIPPET_CONTEXT_CHARACTERS = 60;

    public function __construct(
        private ReportSearchAccess $access,
        private ReportReferenceRecognizer $recognizer,
        private TieredSearch $tiers,
    ) {}

    public function search(SearchQuery|RefreshCandidates $query): SearchBatch
    {
        $constraints = $this->access->constraints($query->reader);

        if ($constraints->recordIds->hasNoneAllowed()) {
            return SearchBatch::nothing();
        }

        return $this->tiers->search($query, new TieredSearchSource(
            admitted: fn () => self::admitted($constraints),
            idColumn: 'id',
            titleColumn: 'title',
            columns: ['id', 'number', 'title'],
            titleOf: fn (Report $report): string => $report->title,
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $reportId) => $this->access->admitsOpen($query->reader, $reportId),
            referenceOf: fn (SearchQuery $asked, TieredSearchSource $reports): SearchResult|null => $this->tiers
                ->numberedReference($asked, $this->recognizer, $reports),
            body: new SearchableBody('body', self::bodyHit(...), self::currentPassage(...)),
        ));
    }

    /**
     * @return ReadBuilder<Report>
     */
    private static function admitted(AdmittedConstraints $constraints): ReadBuilder
    {
        $query = Report::query();

        if ($constraints->recordIds->isRestricted()) {
            $query->whereKey($constraints->recordIds->names());
        }

        return $query;
    }

    private static function hitOf(Report $report, ScoreTier $tier): SearchResult
    {
        return SearchResult::shortened(
            "Report {$report->number} · {$report->title}",
            $tier === ScoreTier::Reference ? "Report {$report->number}" : $report->title,
            new RecordIdentity(Report::linkType(), $report->id),
            $tier,
        );
    }

    private static function bodyHit(Report $report, BodyMatch $match): SearchResult
    {
        return SearchResult::shortened(
            "Report {$report->number} · {$report->title}",
            $match->snippet(self::SNIPPET_CONTEXT_CHARACTERS),
            new RecordIdentity(Report::linkType(), $report->id),
            ScoreTier::BodyContains,
            new PublicationPassage(null, $match->line)->location(),
        );
    }

    /**
     * A held passage as it stands now: the same line that still holds the words, while the title holds no tier.
     */
    private static function currentPassage(
        Report $report,
        string $body,
        HitIdentity $held,
        SearchWords $words,
    ): SearchResult|null {
        if (! PublicationPassage::isId($held->locationId)) {
            return null;
        }

        $passage = PublicationPassage::fromId($held->locationId);
        $excerpt = $passage->excerptOf($body);

        if ($words->titleTier($report->title) !== null || ! $words->isFoundIn($excerpt)) {
            return null;
        }

        return self::bodyHit($report, new BodyMatch($excerpt, $words->columnIn($excerpt), 0, $passage->line));
    }
}
