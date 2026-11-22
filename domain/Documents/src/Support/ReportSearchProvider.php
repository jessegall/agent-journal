<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Contracts\SearchProvider;
use App\Enums\ScoreTier;
use App\Support\RecordIdentity;
use App\Support\TieredRecordSearch;
use App\Values\AdmittedConstraints;
use App\Values\HitIdentity;
use App\Values\SearchableBody;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchResult;
use App\Values\TieredSearchSource;
use Domain\Documents\Models\Report;
use Domain\Documents\Values\PublicationPassage;
use Illuminate\Database\Eloquent\Builder;

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
        private TieredRecordSearch $tiers,
    ) {}

    public function search(SearchQuery $query): SearchBatch
    {
        $constraints = $this->access->constraints($query->reader);

        if ($constraints->recordIds->admitsNone()) {
            return SearchBatch::exhausted('', []);
        }

        return $this->tiers->search($query, new TieredSearchSource(
            admitted: fn () => self::admitted($constraints),
            idColumn: 'id',
            titleColumn: 'title',
            columns: ['id', 'number', 'title'],
            titleOf: fn (Report $report): string => $report->title,
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $reportId): bool => $this->access->admitsOpen($query->reader, $reportId),
            referenceOf: fn (SearchQuery $asked, TieredSearchSource $reports): SearchResult|null => $this->tiers
                ->numberedReference($asked, $this->recognizer, $reports),
            body: new SearchableBody('body', self::bodyHit(...), self::currentPassage(...)),
        ));
    }

    /**
     * @return Builder<Report>
     */
    private static function admitted(AdmittedConstraints $constraints): Builder
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
            new RecordIdentity(Report::LINK_TYPE, $report->id),
            $tier,
        );
    }

    private static function bodyHit(
        Report $report,
        string $text,
        int $column,
        int $characterOffset,
        int $line,
    ): SearchResult {
        return SearchResult::shortened(
            "Report {$report->number} · {$report->title}",
            mb_substr($text, max(0, $column - self::SNIPPET_CONTEXT_CHARACTERS), SearchResult::SNIPPET_CHARACTER_LIMIT),
            new RecordIdentity(Report::LINK_TYPE, $report->id),
            ScoreTier::BodyContains,
            new PublicationPassage(null, $line)->location(),
        );
    }

    /**
     * A held passage as it stands now: the same line that still holds the words, while the title holds no tier.
     */
    private static function currentPassage(
        Report $report,
        string $body,
        HitIdentity $held,
        SearchQuery $query,
    ): SearchResult|null {
        if ($held->locationId === null || ! PublicationPassage::isId($held->locationId)) {
            return null;
        }

        $passage = PublicationPassage::fromId($held->locationId);
        $excerpt = $passage->excerptOf($body);

        if ($query->words->titleTier($report->title) !== null || ! $query->words->isFoundIn($excerpt)) {
            return null;
        }

        $found = mb_stripos($excerpt, $query->words->text);

        return self::bodyHit($report, $excerpt, $found === false ? 0 : $found, 0, $passage->line);
    }
}
