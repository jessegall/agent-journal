<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\RecordResolver;
use App\Contracts\RecordSearch;
use App\Enums\ScoreTier;
use App\Enums\SearchStatus;
use App\Exceptions\SearchBatchInvalid;
use App\Exceptions\SearchHandleRefused;
use App\Exceptions\SearchRequestInvalid;
use App\Exceptions\SearchRestartRequired;
use App\Exceptions\SearchStateFull;
use App\Exceptions\SearchValueInvalid;
use App\Exceptions\StatementTimedOut;
use App\Exceptions\WorkBudgetSpent;
use App\Support\Stored\StoredSearchHit;
use App\Support\Stored\StoredSearchPage;
use App\Support\Stored\StoredSearchProgress;
use App\Values\BufferedHit;
use App\Values\DeclaredSearchable;
use App\Values\EmittedHit;
use App\Values\SearchAnswer;
use App\Values\SearchBatch;
use App\Values\SearchCallMeter;
use App\Values\SearchOwner;
use App\Values\SearchPosition;
use App\Values\SearchQuery;
use App\Values\SearchReader;
use App\Values\SearchRequest;
use App\Values\SearchResult;
use App\Values\SearchScope;
use App\Values\WorkBudget;
use Illuminate\Contracts\Container\Container;

/**
 * Runs one search across the sources a reader may search: a complete reference is answered first through the one
 * source that recognizes it; otherwise each source is asked for certified hits within its deadline, and the heads
 * are merged into one order by tier and identity, never past or repeating a hit already shown. Hits held from an
 * earlier call are reread and rechecked before they are shown. It reads no model and trusts no saved text.
 */
final readonly class SearchCoordinator implements RecordSearch
{
    public const int SOURCE_MILLISECONDS = 150;

    public const int CALL_MILLISECONDS = 1000;

    public const int BATCH_LIMIT = 8;

    public const int RESPONSE_BYTE_LIMIT = 49_152;

    private const string SOURCE_STALLED = 'A source did not answer in time; search one of the other sources instead.';

    private const string LIMIT_REACHED = 'The search reached its work limit before it found more; search again with '
        .'other words.';

    public const int STALL_LIMIT = 2;

    public const int IDLE_CALL_LIMIT = 16;

    public function __construct(
        private SearchEligibility $eligibility,
        private SearchStates $states,
        private RecordResolver $records,
        private SearchDiagnostics $diagnostics,
        private Container $container,
    ) {}

    /**
     * @throws SearchHandleRefused
     * @throws SearchRequestInvalid
     * @throws SearchStateFull
     */
    public function search(SearchOwner $owner, SearchReader $reader, SearchRequest $request): SearchAnswer
    {
        if ($request->continues()) {
            return $this->resume($owner, $reader, $request->continuationHandle());
        }

        return $this->start($owner, $reader, $request);
    }

    /**
     * @throws SearchStateFull
     */
    private function start(SearchOwner $owner, SearchReader $reader, SearchRequest $request): SearchAnswer
    {
        $scope = $this->eligibility->scopeOf($reader, $request);

        if (! $scope->answer->canSearch()) {
            return SearchAnswer::forScope($scope);
        }

        $within = $scope->searchScope()->within;
        $sources = $this->sourcesFor($reader, $scope->searchScope());

        if ($sources === [] || $request->words === null) {
            return SearchAnswer::noSources();
        }

        $progress = SearchProgress::starting($request->words, $within, $request->limit, array_keys($sources));
        $progress->calls++;
        $meter = new SearchCallMeter();
        $deadline = self::deadline();
        $fresh = [];
        $recognizing = $this->recognizing($sources, $progress);

        if (count($recognizing) > 1) {
            $answer = new SearchAnswer(SearchStatus::Pending, sourceChoices: array_keys($recognizing));

            return $this->started($owner, $answer, $progress);
        }

        if ($recognizing !== []) {
            $source = reset($recognizing);
            $this->ask($reader, $progress, $source, $deadline, $meter, $fresh);
            $direct = $this->directHit($reader, $progress->sources[$source->qualifiedKey], $source, $fresh);

            if ($direct !== null) {
                $answer = $this->measured($progress, $meter, new SearchAnswer(SearchStatus::More, directOpen: $direct));

                return $this->started($owner, $answer, $progress);
            }
        }

        return $this->started(
            $owner,
            $this->measured($progress, $meter, $this->run($reader, $progress, $sources, $deadline, $meter, $fresh)),
            $progress,
        );
    }

    /**
     * @throws SearchHandleRefused
     * @throws SearchStateFull
     */
    private function resume(SearchOwner $owner, SearchReader $reader, string $handle): SearchAnswer
    {
        try {
            $position = $this->states->resume($owner, $handle);
        } catch (SearchRestartRequired) {
            return SearchAnswer::restart();
        }

        $stored = StoredSearchProgress::from(json_decode($position->state, true, 16, JSON_THROW_ON_ERROR));
        $progress = SearchProgress::fromStored($stored);
        $sources = $this->stillEligible($reader, $progress);

        if ($position->wasResumed()) {
            return $this->replay($reader, $stored, $sources, $position);
        }

        $progress->calls++;
        $meter = new SearchCallMeter();
        $fresh = $this->refreshBuffers($reader, $progress, $sources);
        $ran = $this->run($reader, $progress, $sources, self::deadline(), $meter, $fresh);
        $answer = $this->measured($progress, $meter, $ran);
        $page = self::pageOf($answer);

        try {
            $next = $this->states->advance($owner, $handle, $page, $progress->toJson());
        } catch (SearchRestartRequired) {
            return SearchAnswer::restart();
        }

        if ($next->page !== $page) {
            return $this->replay($reader, $stored, $sources, $next);
        }

        return $answer->withContinuation($answer->status->continues() ? $next->successor : null);
    }

    /**
     * Asks the sources that have no head, at most eight batches a call, until the page is full, every source is
     * done, one stalls for good, the call's time runs out or a source timed out once, then answers with the status
     * that fits.
     *
     * @param  array<string, DeclaredSearchable>  $sources
     * @param  array<string, SearchResult>  $fresh
     */
    private function run(
        SearchReader $reader,
        SearchProgress $progress,
        array $sources,
        int $deadline,
        SearchCallMeter $meter,
        array $fresh,
    ): SearchAnswer {
        $emitted = [];
        $timedOut = false;
        $visible = [];
        $batches = 0;

        while (true) {
            $asked = 0;

            foreach ($progress->sources as $key => $source) {
                if (! $source->awaitsRefill() || $batches >= self::BATCH_LIMIT || ! self::hasTime($deadline)) {
                    continue;
                }

                $batches++;
                $asked++;

                if ($this->ask($reader, $progress, $sources[$key], $deadline, $meter, $fresh)) {
                    $source->stalls = 0;

                    continue;
                }

                $source->stalls++;

                if ($source->stalls >= self::STALL_LIMIT) {
                    return $this->incomplete($progress, $sources, $emitted, $key)
                        ->withFailedSources($progress->failedSourceKeys());
                }

                $timedOut = true;
            }

            $this->markVisible($progress->sources, $visible);
            $bytesFull = $this->emit($reader, $progress, $sources, $fresh, $visible, $emitted);

            if ($bytesFull && $emitted === []) {
                return SearchAnswer::resultTooLarge();
            }

            $pageFull = $bytesFull || count($emitted) >= $progress->limit;

            $canAskAgain = $progress->hasSourceToRefill() && $batches < self::BATCH_LIMIT;

            if ($pageFull || ! $canAskAgain || $timedOut || ! self::hasTime($deadline)) {
                break;
            }
        }

        return $this->ended($progress, $sources, $emitted, $timedOut)->withFailedSources($progress->failedSourceKeys());
    }

    /**
     * Writes this call's diagnostic lines, one per source asked, and passes the answer on.
     */
    private function measured(SearchProgress $progress, SearchCallMeter $meter, SearchAnswer $answer): SearchAnswer
    {
        $this->diagnostics->record($progress->calls, $meter);

        return $answer;
    }

    /**
     * Asks one source for its next batch and keeps its certified hits; false when it ran past its deadline, spent
     * its work allowance or reported the same work position again, so its answer is discarded. A batch the search
     * cannot use, too large or malformed, marks the source failed and the rest go on.
     *
     * @param  array<string, SearchResult>  $fresh
     */
    private function ask(
        SearchReader $reader,
        SearchProgress $progress,
        DeclaredSearchable $declared,
        int $deadline,
        SearchCallMeter $meter,
        array &$fresh,
    ): bool {
        $source = $progress->sources[$declared->qualifiedKey];
        $milliseconds = min(self::SOURCE_MILLISECONDS, self::remainingMilliseconds($deadline));
        $query = new SearchQuery(
            $reader,
            $progress->words,
            self::scopeOf($progress),
            $declared->qualifiedKey,
            min(SearchQuery::HIT_LIMIT, $progress->limit + 1),
            WorkBudget::forBatch($milliseconds),
            $source->position,
        );

        $started = hrtime(true);

        try {
            $batch = $declared->provider($this->container)->search($query);
        } catch (WorkBudgetSpent) {
            return self::noted($meter, $declared, $started, $query, 'budget_spent', false);
        } catch (StatementTimedOut) {
            return self::noted($meter, $declared, $started, $query, 'statement_cancelled', false);
        } catch (SearchBatchInvalid|SearchValueInvalid) {
            $source->fail();

            return self::noted($meter, $declared, $started, $query, 'invalid_batch', true);
        }

        if (hrtime(true) - $started > self::SOURCE_MILLISECONDS * 1_000_000) {
            return self::noted($meter, $declared, $started, $query, 'timed_out', false);
        }

        if ($batch->byteSize() > WorkBudget::BYTE_LIMIT) {
            $source->fail();

            return self::noted($meter, $declared, $started, $query, 'too_large', true);
        }

        $kept = $this->keep($source, $declared, $batch, $fresh);
        self::noted($meter, $declared, $started, $query, $kept ? $batch->outcome->name() : 'stalled', $kept);

        return $kept;
    }

    /**
     * Adds the batch's work to the source's line for this call and passes on whether its answer was kept.
     */
    private static function noted(
        SearchCallMeter $meter,
        DeclaredSearchable $declared,
        int $started,
        SearchQuery $query,
        string $outcome,
        bool $kept,
    ): bool {
        $meter->add($declared->qualifiedKey, intdiv(hrtime(true) - $started, 1000), $query->budget, $outcome);

        return $kept;
    }

    /**
     * @param  array<string, SearchResult>  $fresh
     */
    private function keep(SourceProgress $source, DeclaredSearchable $declared, SearchBatch $batch, array &$fresh): bool
    {
        if (! $source->take($batch->outcome)) {
            return false;
        }

        if (! $batch->outcome->canCarryHits()) {
            return true;
        }

        foreach ($batch->hits as $hit) {
            $identity = $hit->identity($declared->qualifiedKey);
            $source->buffer[] = new BufferedHit($identity, $hit->score);
            $fresh[$identity->key()] = $hit;
        }

        return true;
    }

    /**
     * Shows heads in the one global order while every unfinished source has a head to compare, and while the answer
     * has room: a hit that does not fit, even without its optional excerpt, stays held for the next call. True when
     * the answer's bytes are full.
     *
     * @param  array<string, DeclaredSearchable>  $sources
     * @param  array<string, SearchResult>  $fresh
     * @param  array<string, true>  $visible
     * @param  list<EmittedHit>  $emitted
     */
    private function emit(
        SearchReader $reader,
        SearchProgress $progress,
        array $sources,
        array $fresh,
        array $visible,
        array &$emitted,
    ): bool {
        while (count($emitted) < $progress->limit) {
            if (array_any($progress->sources, fn (SourceProgress $source): bool => $source->awaitsRefill())) {
                return false;
            }

            $leader = $progress->leader();
            $head = $leader?->head();

            if ($leader === null || $head === null) {
                return false;
            }

            $leader->dropHead();

            if ($progress->wasDelivered($head->identity) || ! $progress->isPastFrontier($head)) {
                continue;
            }

            if (! isset($visible[self::recordKey($head->identity->recordType, $head->identity->recordId)])) {
                continue;
            }

            $hit = $this->shown($reader, $sources[$leader->sourceKey], $fresh[$head->identity->key()] ?? null);

            if ($hit === null) {
                continue;
            }

            $fitting = self::fitting($hit, $emitted);

            if ($fitting === null) {
                $leader->putBack($head);

                return true;
            }

            $emitted[] = $fitting;
            $progress->deliver($head);
        }

        return false;
    }

    /**
     * The hit as it fits the answer's remaining bytes: whole, or without its optional excerpt; null when neither fits.
     *
     * @param  list<EmittedHit>  $emitted
     */
    private static function fitting(EmittedHit $hit, array $emitted): EmittedHit|null
    {
        $used = array_sum(array_map(fn (EmittedHit $shown): int => $shown->byteSize(), $emitted));

        if ($used + $hit->byteSize() <= self::RESPONSE_BYTE_LIMIT) {
            return $hit;
        }

        $bare = $hit->withoutSnippet();

        return $used + $bare->byteSize() <= self::RESPONSE_BYTE_LIMIT ? $bare : null;
    }

    /**
     * The hit as shown, when its current match is known and the reader may still open it now.
     */
    private function shown(SearchReader $reader, DeclaredSearchable $source, SearchResult|null $result): EmittedHit|null
    {
        if ($result === null || ! $this->eligibility->admits($reader, $source)) {
            return null;
        }

        $access = $this->eligibility->access($source);

        if (! $access->admitsOpen($reader, $result->reference->id)) {
            return null;
        }

        return EmittedHit::of($source, $result, $access->openAction($result->reference->id, $result->location));
    }

    /**
     * The direct open of the recognized reference: the source's first hit when it is a reference hit the reader may
     * open; an absent or denied target gives none, so the search answers as an ordinary one.
     *
     * @param  array<string, SearchResult>  $fresh
     */
    private function directHit(
        SearchReader $reader,
        SourceProgress $source,
        DeclaredSearchable $declared,
        array $fresh,
    ): EmittedHit|null {
        $head = $source->head();

        if ($head === null || $head->score !== ScoreTier::Reference) {
            return null;
        }

        $visible = [];
        $this->markVisible([$source], $visible);

        if (! isset($visible[self::recordKey($head->identity->recordType, $head->identity->recordId)])) {
            return null;
        }

        return $this->shown($reader, $declared, $fresh[$head->identity->key()] ?? null);
    }

    /**
     * Rereads every held hit of each source in one refresh and keeps those still matching at the same tier.
     *
     * @param  array<string, DeclaredSearchable>  $sources
     * @return array<string, SearchResult>
     */
    private function refreshBuffers(SearchReader $reader, SearchProgress $progress, array $sources): array
    {
        $fresh = [];

        foreach ($progress->sources as $key => $source) {
            if ($source->buffer === []) {
                continue;
            }

            $current = $this->refreshed($reader, $progress, $sources[$key], $source->buffer);
            $kept = [];

            foreach ($source->buffer as $held) {
                $match = $current->currentMatch($held->identity);

                if ($match !== null && $match->score === $held->score) {
                    $kept[] = $held;
                    $fresh[$held->identity->key()] = $match;
                }
            }

            $source->buffer = $kept;
        }

        return $fresh;
    }

    /**
     * @param  list<BufferedHit>  $held
     */
    private function refreshed(
        SearchReader $reader,
        SearchProgress $progress,
        DeclaredSearchable $declared,
        array $held,
    ): SearchBatch {
        $query = new SearchQuery(
            $reader,
            $progress->words,
            self::scopeOf($progress),
            $declared->qualifiedKey,
            1,
            WorkBudget::forBatch(self::SOURCE_MILLISECONDS),
        );

        return $declared->provider($this->container)->search(
            $query->refreshing(array_map(fn (BufferedHit $hit) => $hit->identity, $held)),
        );
    }

    /**
     * The page a retained position produced before, reread and rechecked, so a replay never shows saved text.
     *
     * @param  array<string, DeclaredSearchable>  $sources
     *
     * @throws SearchRestartRequired
     */
    private function replay(
        SearchReader $reader,
        StoredSearchProgress $stored,
        array $sources,
        SearchPosition $position,
    ): SearchAnswer {
        $progress = SearchProgress::fromStored($stored);
        $page = StoredSearchPage::from(json_decode($position->replayedPage(), true, 8, JSON_THROW_ON_ERROR));
        $status = $page->status;
        $pageHits = array_map(fn (StoredSearchHit $stored): BufferedHit => $stored->toBufferedHit(), $page->hits);
        $held = [];

        foreach ($pageHits as $hit) {
            if (isset($sources[$hit->identity->sourceKey])) {
                $held[$hit->identity->sourceKey][] = $hit;
            }
        }

        $current = [];
        $visible = $this->visibleAmong(array_merge(...array_values($held)));

        foreach ($held as $key => $hits) {
            $batch = $this->refreshed($reader, $progress, $sources[$key], $hits);

            foreach ($hits as $hit) {
                $match = $batch->currentMatch($hit->identity);
                $seen = isset($visible[self::recordKey($hit->identity->recordType, $hit->identity->recordId)]);
                $current[$hit->identity->key()] = $seen ? $this->shown($reader, $sources[$key], $match) : null;
            }
        }

        $hits = [];

        foreach ($pageHits as $hit) {
            $shown = $current[$hit->identity->key()] ?? null;

            if ($shown !== null) {
                $hits[] = $shown;
            }
        }

        return new SearchAnswer(
            $status,
            $hits,
            narrowerScopes: $page->narrower,
            continuation: $status->continues() ? $position->successor : null,
        );
    }

    /**
     * @param  array<string, DeclaredSearchable>  $sources
     * @param  list<EmittedHit>  $emitted
     */
    private function ended(SearchProgress $progress, array $sources, array $emitted, bool $timedOut): SearchAnswer
    {
        if ($progress->isFinished()) {
            return new SearchAnswer(SearchStatus::Complete, $emitted);
        }

        if ($emitted !== []) {
            $progress->idleCalls = 0;

            return new SearchAnswer($timedOut ? SearchStatus::Retryable : SearchStatus::More, $emitted);
        }

        $progress->idleCalls++;

        if ($progress->idleCalls >= self::IDLE_CALL_LIMIT) {
            return $this->incomplete($progress, $sources, $emitted, null);
        }

        return new SearchAnswer($timedOut ? SearchStatus::Retryable : SearchStatus::Pending);
    }

    /**
     * Ends this attempt with no cursor, offering each other source as a fresh scope only when narrowing avoids the
     * source that stalled.
     *
     * @param  array<string, DeclaredSearchable>  $sources
     * @param  list<EmittedHit>  $emitted
     */
    private function incomplete(
        SearchProgress $progress,
        array $sources,
        array $emitted,
        string|null $stalledKey,
    ): SearchAnswer {
        $others = array_values(array_filter(
            array_keys($sources),
            fn (string $key): bool => $key !== $stalledKey && ! $progress->sources[$key]->isDone(),
        ));
        $narrower = count($sources) > 1 && $progress->within === null ? $others : [];

        return new SearchAnswer(
            SearchStatus::Incomplete,
            $emitted,
            narrowerScopes: $narrower,
            words: $narrower === [] ? null : $progress->words->text,
            reason: $narrower === [] ? self::LIMIT_REACHED : self::SOURCE_STALLED,
        );
    }

    /**
     * Keeps the progress of a fresh search behind a new handle when the answer continues.
     *
     * @throws SearchStateFull
     */
    private function started(SearchOwner $owner, SearchAnswer $answer, SearchProgress $progress): SearchAnswer
    {
        if (! $answer->status->continues()) {
            return $answer;
        }

        return $answer->withContinuation($this->states->start($owner, $progress->toJson()));
    }

    /**
     * The eligible sources the scope covers, by qualified key in binary order; the set is fixed for the search.
     *
     * @return array<string, DeclaredSearchable>
     */
    private function sourcesFor(SearchReader $reader, SearchScope $scope): array
    {
        $sources = [];

        foreach ($this->eligibility->eligible($reader) as $source) {
            if ($scope->covers($source->qualifiedKey)) {
                $sources[$source->qualifiedKey] = $source;
            }
        }

        return $sources;
    }

    /**
     * The sources of a resumed search the reader may still search; the work of one it lost is discarded.
     *
     * @return array<string, DeclaredSearchable>
     */
    private function stillEligible(SearchReader $reader, SearchProgress $progress): array
    {
        $eligible = $this->sourcesFor($reader, self::scopeOf($progress));

        foreach (array_keys($progress->sources) as $key) {
            if (! isset($eligible[$key])) {
                unset($progress->sources[$key]);
            }
        }

        return array_intersect_key($eligible, $progress->sources);
    }

    /**
     * The sources whose recognizer reads the whole words as one of its complete references.
     *
     * @param  array<string, DeclaredSearchable>  $sources
     * @return array<string, DeclaredSearchable>
     */
    private function recognizing(array $sources, SearchProgress $progress): array
    {
        return array_filter(
            $sources,
            fn (DeclaredSearchable $source): bool => $source->recognizer($this->container)
                ?->recognize($progress->words->text) !== null,
        );
    }

    /**
     * Checks every held record not checked yet in one batch: the records the reader may see, by type and id, through
     * the owners' record providers. A record of a type no provider answers for is never visible.
     *
     * @param  array<string, SourceProgress>|list<SourceProgress>  $sources
     * @param  array<string, true>  $visible
     */
    private function markVisible(array $sources, array &$visible): void
    {
        $held = [];

        foreach ($sources as $source) {
            foreach ($source->buffer as $hit) {
                if (! isset($visible[self::recordKey($hit->identity->recordType, $hit->identity->recordId)])) {
                    $held[] = $hit;
                }
            }
        }

        $visible = [...$visible, ...$this->visibleAmong($held)];
    }

    /**
     * @param  list<BufferedHit>  $held
     * @return array<string, true>
     */
    private function visibleAmong(array $held): array
    {
        $known = $this->records->types();
        $records = [];

        foreach ($held as $hit) {
            if (! in_array($hit->identity->recordType, $known, true)) {
                continue;
            }

            $key = self::recordKey($hit->identity->recordType, $hit->identity->recordId);
            $records[$key] = new RecordIdentity($hit->identity->recordType, $hit->identity->recordId);
        }

        if ($records === []) {
            return [];
        }

        $visible = [];

        foreach ($this->records->visibleCards(array_values($records)) as $card) {
            $visible[self::recordKey($card->type, $card->id)] = true;
        }

        return $visible;
    }

    private static function recordKey(string $type, string $id): string
    {
        return "{$type}\0{$id}";
    }

    private static function pageOf(SearchAnswer $answer): string
    {
        return StoredSearchPage::fromAnswer($answer)->toJson();
    }

    private static function scopeOf(SearchProgress $progress): SearchScope
    {
        return $progress->within === null ? SearchScope::everywhere() : SearchScope::within($progress->within);
    }

    private static function deadline(): int
    {
        return hrtime(true) + self::CALL_MILLISECONDS * 1_000_000;
    }

    private static function hasTime(int $deadline): bool
    {
        return hrtime(true) < $deadline;
    }

    private static function remainingMilliseconds(int $deadline): int
    {
        return max(1, intdiv($deadline - hrtime(true), 1_000_000));
    }
}
