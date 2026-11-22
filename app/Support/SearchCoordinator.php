<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ScoreTier;
use App\Enums\SearchStatus;
use App\Exceptions\SearchHandleRefused;
use App\Exceptions\SearchRequestInvalid;
use App\Exceptions\SearchRestartRequired;
use App\Exceptions\SearchStateFull;
use App\Values\BufferedHit;
use App\Values\DeclaredSearchable;
use App\Values\EmittedHit;
use App\Values\ExhaustedOutcome;
use App\Values\FailedOutcome;
use App\Values\MoreOutcome;
use App\Values\ScanningOutcome;
use App\Values\SearchAnswer;
use App\Values\SearchBatch;
use App\Values\SearchOwner;
use App\Values\SearchPosition;
use App\Values\SearchProgress;
use App\Values\SearchQuery;
use App\Values\SearchReader;
use App\Values\SearchRequest;
use App\Values\SearchResult;
use App\Values\SearchScope;
use App\Values\SourceProgress;
use App\Values\WorkBudget;
use Illuminate\Contracts\Container\Container;

/**
 * Runs one search across the sources a reader may search: a complete reference is answered first through the one
 * source that recognizes it; otherwise each source is asked for certified hits within its deadline, and the heads
 * are merged into one order by tier and identity, never past or repeating a hit already shown. Hits held from an
 * earlier call are reread and rechecked before they are shown. It reads no model and trusts no saved text.
 */
final readonly class SearchCoordinator
{
    public const int SOURCE_MILLISECONDS = 150;

    public const int CALL_MILLISECONDS = 1000;

    public const int ROUND_LIMIT = 8;

    public const int STALL_LIMIT = 2;

    public const int IDLE_CALL_LIMIT = 16;

    public function __construct(
        private SearchEligibility $eligibility,
        private SearchStates $states,
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

        if (! $scope->answer->admitsSearch()) {
            return SearchAnswer::forScope($scope);
        }

        $within = $scope->searchScope()->within;
        $sources = $this->sourcesFor($reader, $scope->searchScope());

        if ($sources === [] || $request->words === null) {
            return SearchAnswer::noSources();
        }

        $progress = SearchProgress::starting($request->words, $within, $request->limit, array_keys($sources));
        $deadline = self::deadline();
        $fresh = [];
        $recognizing = $this->recognizing($sources, $progress);

        if (count($recognizing) > 1) {
            $answer = new SearchAnswer(SearchStatus::Pending, sourceChoices: array_keys($recognizing));

            return $this->started($owner, $answer, $progress);
        }

        if ($recognizing !== []) {
            $source = reset($recognizing);
            $this->ask($reader, $progress, $source, $deadline, $fresh);
            $direct = $this->directHit($reader, $progress->sources[$source->qualifiedKey], $source, $fresh);

            if ($direct !== null) {
                return $this->started($owner, new SearchAnswer(SearchStatus::More, directOpen: $direct), $progress);
            }
        }

        return $this->started($owner, $this->run($reader, $progress, $sources, $deadline, $fresh), $progress);
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

        $progress = SearchProgress::fromJson($position->state);
        $sources = $this->stillEligible($reader, $progress);

        if ($position->wasResumed()) {
            return $this->replay($reader, $progress, $sources, $position);
        }

        $fresh = $this->refreshBuffers($reader, $progress, $sources);
        $answer = $this->run($reader, $progress, $sources, self::deadline(), $fresh);
        $page = self::pageOf($answer);

        try {
            $next = $this->states->advance($owner, $handle, $page, $progress->toJson());
        } catch (SearchRestartRequired) {
            return SearchAnswer::restart();
        }

        if ($next->page !== $page) {
            return $this->replay($reader, SearchProgress::fromJson($position->state), $sources, $next);
        }

        return $answer->withContinuation($answer->status->continues() ? $next->successor : null);
    }

    /**
     * Asks the sources in rounds until the page is full, every source is done, one stalls for good, the call's time
     * runs out or a source timed out once, then answers with the status that fits.
     *
     * @param  array<string, DeclaredSearchable>  $sources
     * @param  array<string, SearchResult>  $fresh
     */
    private function run(
        SearchReader $reader,
        SearchProgress $progress,
        array $sources,
        int $deadline,
        array $fresh,
    ): SearchAnswer {
        $emitted = [];
        $timedOut = false;

        for ($round = 0; $round < self::ROUND_LIMIT; $round++) {
            foreach ($progress->sources as $key => $source) {
                if (! $source->needsRefill() || ! self::hasTime($deadline)) {
                    continue;
                }

                if ($this->ask($reader, $progress, $sources[$key], $deadline, $fresh)) {
                    $source->stalls = 0;

                    continue;
                }

                $source->stalls++;

                if ($source->stalls >= self::STALL_LIMIT) {
                    return $this->incomplete($progress, $sources, $emitted, $key);
                }

                $timedOut = true;
            }

            $this->emit($reader, $progress, $sources, $fresh, $emitted);

            $pageFull = count($emitted) >= $progress->limit;

            if ($pageFull || $progress->isFinished() || $timedOut || ! self::hasTime($deadline)) {
                break;
            }
        }

        return $this->ended($progress, $sources, $emitted, $timedOut);
    }

    /**
     * Asks one source for its next batch and keeps its certified hits; false when it ran past its deadline or
     * reported the same work position again, so its answer is discarded.
     *
     * @param  array<string, SearchResult>  $fresh
     */
    private function ask(
        SearchReader $reader,
        SearchProgress $progress,
        DeclaredSearchable $declared,
        int $deadline,
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
        $batch = $declared->searchable->providerFrom($this->container)->search($query);

        if (hrtime(true) - $started > self::SOURCE_MILLISECONDS * 1_000_000) {
            return false;
        }

        return $this->keep($source, $declared, $batch, $fresh);
    }

    /**
     * @param  array<string, SearchResult>  $fresh
     */
    private function keep(SourceProgress $source, DeclaredSearchable $declared, SearchBatch $batch, array &$fresh): bool
    {
        $outcome = $batch->outcome;

        if ($outcome instanceof ScanningOutcome) {
            if ($source->position !== null && $outcome->nextWork->equals($source->position)) {
                return false;
            }

            $source->position = $outcome->nextWork;

            return true;
        }

        if ($outcome instanceof FailedOutcome) {
            $source->exhausted = true;
            $source->buffer = [];

            return true;
        }

        foreach ($batch->hits as $hit) {
            $identity = $hit->identity($declared->qualifiedKey);
            $source->buffer[] = new BufferedHit($identity, $hit->score);
            $fresh[$identity->key()] = $hit;
        }

        if ($outcome instanceof MoreOutcome) {
            $source->position = $outcome->nextSeek;
        }

        $source->exhausted = $outcome instanceof ExhaustedOutcome;

        return true;
    }

    /**
     * Shows heads in the one global order while every unfinished source has a head to compare.
     *
     * @param  array<string, DeclaredSearchable>  $sources
     * @param  array<string, SearchResult>  $fresh
     * @param  list<EmittedHit>  $emitted
     */
    private function emit(
        SearchReader $reader,
        SearchProgress $progress,
        array $sources,
        array $fresh,
        array &$emitted,
    ): void {
        while (count($emitted) < $progress->limit) {
            if (array_any($progress->sources, fn (SourceProgress $source): bool => $source->needsRefill())) {
                return;
            }

            $leader = self::leader($progress);

            if ($leader === null) {
                return;
            }

            $head = $leader->head();
            $leader->dropHead();

            if ($head === null || $progress->wasDelivered($head->identity) || ! $progress->isPastFrontier($head)) {
                continue;
            }

            $hit = $this->shown($reader, $sources[$leader->sourceKey], $fresh[$head->identity->key()] ?? null);

            if ($hit !== null) {
                $emitted[] = $hit;
                $progress->deliver($head);
            }
        }
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

        return $declared->searchable->providerFrom($this->container)->search(
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
        SearchProgress $progress,
        array $sources,
        SearchPosition $position,
    ): SearchAnswer {
        $page = json_decode($position->replayedPage(), true, 8, JSON_THROW_ON_ERROR);
        $status = SearchStatus::from($page['status']);
        $held = [];

        foreach ($page['hits'] as $fields) {
            $hit = BufferedHit::fromArray($fields);

            if (isset($sources[$hit->identity->sourceKey])) {
                $held[$hit->identity->sourceKey][] = $hit;
            }
        }

        $current = [];

        foreach ($held as $key => $hits) {
            $batch = $this->refreshed($reader, $progress, $sources[$key], $hits);

            foreach ($hits as $hit) {
                $match = $batch->currentMatch($hit->identity);
                $current[$hit->identity->key()] = $this->shown($reader, $sources[$key], $match);
            }
        }

        $hits = [];

        foreach ($page['hits'] as $fields) {
            $shown = $current[BufferedHit::fromArray($fields)->identity->key()] ?? null;

            if ($shown !== null) {
                $hits[] = $shown;
            }
        }

        return new SearchAnswer(
            $status,
            $hits,
            narrowerScopes: $page['narrower'],
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
            fn (DeclaredSearchable $source): bool => $source->searchable->recognizerFrom($this->container)
                ?->recognize($progress->words->text) !== null,
        );
    }

    /**
     * The source whose head leads the one global order, among the sources with a head.
     */
    private static function leader(SearchProgress $progress): SourceProgress|null
    {
        $leader = null;

        foreach ($progress->sources as $source) {
            $head = $source->head();

            if ($head !== null && ($leader === null || $head->compare($leader->head()) < 0)) {
                $leader = $source;
            }
        }

        return $leader;
    }

    private static function pageOf(SearchAnswer $answer): string
    {
        return json_encode([
            'status' => $answer->status->value,
            'hits' => array_map(
                fn (EmittedHit $hit) => new BufferedHit($hit->identity(), $hit->score)->toArray(),
                $answer->hits,
            ),
            'narrower' => $answer->narrowerScopes,
        ], JSON_THROW_ON_ERROR);
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
