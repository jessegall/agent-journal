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
use Domain\Documents\Models\Document;
use Domain\Documents\Values\PublicationPassage;

/**
 * Searches documents as published through the shared bounded tiered search: a reference such as doc 104 first, then
 * the published title, then the published body, whose hits name the revision and line they were found at. A draft's
 * words and title never reach it, since only the latest closed revision is read.
 */
final readonly class DocumentSearchProvider implements SearchProvider
{
    private const int SNIPPET_CONTEXT_CHARACTERS = 60;

    public function __construct(
        private DocumentSearchAccess $access,
        private DocumentReferenceRecognizer $recognizer,
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
            idColumn: 'documents.id',
            titleColumn: 'published.title',
            columns: ['documents.id', 'documents.number', 'published.title as title', 'published.number as revision'],
            titleOf: fn (Document $document) => (string) $document->getAttribute('title'),
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $documentId) => $this->access->admitsOpen($query->reader, $documentId),
            referenceOf: fn (SearchQuery $asked, TieredSearchSource $documents): SearchResult|null => $this->tiers
                ->numberedReference($asked, $this->recognizer, $documents),
            body: new SearchableBody('published.body', self::bodyHit(...), self::currentPassage(...)),
        ));
    }

    /**
     * @return ReadBuilder<Document>
     */
    private static function admitted(AdmittedConstraints $constraints): ReadBuilder
    {
        $query = Document::query()->withPublishedRevision();

        if ($constraints->recordIds->isRestricted()) {
            $query->whereIn('documents.id', $constraints->recordIds->names());
        }

        return $query;
    }

    private static function hitOf(Document $document, ScoreTier $tier): SearchResult
    {
        $title = (string) $document->getAttribute('title');

        return SearchResult::shortened(
            "Doc {$document->number} · {$title}",
            $tier === ScoreTier::Reference ? "Doc {$document->number}" : $title,
            new RecordIdentity(Document::linkType(), $document->id),
            $tier,
        );
    }

    private static function bodyHit(Document $document, BodyMatch $match): SearchResult
    {
        $passage = new PublicationPassage((int) $document->getAttribute('revision'), $match->line);
        $title = (string) $document->getAttribute('title');

        return SearchResult::shortened(
            "Doc {$document->number} · {$title}",
            $match->snippet(self::SNIPPET_CONTEXT_CHARACTERS),
            new RecordIdentity(Document::linkType(), $document->id),
            ScoreTier::BodyContains,
            $passage->location(),
        );
    }

    /**
     * A held passage as it stands now: the same line of the same published revision that still holds the words,
     * while the title holds no tier; null when a newer revision was published or the words left that line.
     */
    private static function currentPassage(
        Document $document,
        string $body,
        HitIdentity $held,
        SearchWords $words,
    ): SearchResult|null {
        if (! PublicationPassage::isId($held->locationId)) {
            return null;
        }

        $passage = PublicationPassage::fromId($held->locationId);
        $excerpt = $passage->excerptOf($body);
        $current = $passage->revision === (int) $document->getAttribute('revision');

        if (! $current || $words->titleTier((string) $document->getAttribute('title')) !== null) {
            return null;
        }

        if (! $words->isFoundIn($excerpt)) {
            return null;
        }

        return self::bodyHit($document, new BodyMatch($excerpt, $words->columnIn($excerpt), 0, $passage->line));
    }
}
