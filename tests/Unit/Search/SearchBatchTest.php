<?php

declare(strict_types=1);

namespace Tests\Unit\Search;

use App\Support\ActorContext;
use App\Support\RecordIdentity;
use App\Enums\FailureReason;
use App\Enums\ScoreTier;
use App\Enums\SearchSurface;
use App\Exceptions\SearchBatchInvalid;
use App\Values\ExhaustedOutcome;
use App\Values\FailedOutcome;
use App\Values\HitIdentity;
use App\Values\MoreOutcome;
use App\Values\RefreshCandidates;
use App\Values\ScanningOutcome;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchReader;
use App\Values\SearchResult;
use App\Values\SearchScope;
use App\Values\SearchWords;
use App\Values\SourcePosition;
use App\Values\WorkBudget;
use PHPUnit\Framework\TestCase;

/**
 * A batch has exactly one outcome: exhausted and more carry ordered hits, more at least one; scanning and failed
 * carry none; a refreshed batch answers only the candidates it was asked about, and an omitted one is dropped.
 */
final class SearchBatchTest extends TestCase
{
    private const string FIRST_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAA';

    private const string SECOND_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAB';

    public function test_each_outcome_is_the_one_the_batch_was_made_with(): void
    {
        $position = SourcePosition::of(['tier' => 400, 'last_id' => self::FIRST_ID]);

        $this->assertInstanceOf(ExhaustedOutcome::class, SearchBatch::exhausted('v1', [])->outcome);
        $this->assertInstanceOf(MoreOutcome::class, SearchBatch::more('v1', [$this->result()], $position)->outcome);
        $this->assertInstanceOf(ScanningOutcome::class, SearchBatch::scanning('v1', $position)->outcome);
        $this->assertInstanceOf(FailedOutcome::class, SearchBatch::failed(FailureReason::StorageFailed)->outcome);
        $this->assertTrue(SearchBatch::failed(FailureReason::StorageFailed)->hasFailed());
        $this->assertNull(SearchBatch::failed(FailureReason::StorageFailed)->observedVersion);
    }

    public function test_a_scan_keeps_the_position_it_moved_to(): void
    {
        $position = SourcePosition::of(['last_id' => self::SECOND_ID, 'tier' => 400]);
        $outcome = SearchBatch::scanning('v1', $position)->outcome;

        $this->assertInstanceOf(ScanningOutcome::class, $outcome);
        $this->assertTrue($outcome->nextWork->equals(SourcePosition::of(['tier' => 400, 'last_id' => self::SECOND_ID])));
    }

    public function test_more_needs_a_certified_hit(): void
    {
        $this->expectException(SearchBatchInvalid::class);

        SearchBatch::more('v1', [], SourcePosition::of(['tier' => 400]));
    }

    public function test_hits_out_of_order_are_refused(): void
    {
        $this->expectException(SearchBatchInvalid::class);

        SearchBatch::exhausted('v1', [
            $this->result(self::FIRST_ID, ScoreTier::TitleContains),
            $this->result(self::SECOND_ID, ScoreTier::ExactTitle),
        ]);
    }

    public function test_tied_hits_out_of_identity_order_are_refused(): void
    {
        $this->expectException(SearchBatchInvalid::class);

        SearchBatch::exhausted('v1', [$this->result(self::SECOND_ID), $this->result(self::FIRST_ID)]);
    }

    public function test_a_repeated_hit_is_refused(): void
    {
        $this->expectException(SearchBatchInvalid::class);

        SearchBatch::exhausted('v1', [$this->result(), $this->result()]);
    }

    public function test_more_hits_than_a_batch_holds_are_refused(): void
    {
        $this->expectException(SearchBatchInvalid::class);

        $hits = [];

        for ($number = 0; $number <= SearchQuery::HIT_LIMIT; $number++) {
            $hits[] = $this->result(sprintf('01ARZ3NDEKTSV4RRFFQ69G%04d', $number));
        }

        SearchBatch::exhausted('v1', $hits);
    }

    public function test_a_refresh_answers_what_it_was_asked_and_drops_the_rest(): void
    {
        $kept = new HitIdentity('tasks.task', 'tasks.task', self::FIRST_ID);
        $dropped = new HitIdentity('tasks.task', 'tasks.task', self::SECOND_ID);
        $refresh = $this->query()->refreshing([$kept, $dropped]);
        $batch = SearchBatch::refreshed('v2', $refresh, [$this->result(self::FIRST_ID)]);

        $this->assertInstanceOf(RefreshCandidates::class, $refresh);
        $this->assertSame([self::FIRST_ID, self::SECOND_ID], $refresh->recordIds());
        $this->assertSame(self::FIRST_ID, $batch->currentMatch($kept)?->reference->id);
        $this->assertNull($batch->currentMatch($dropped));
    }

    public function test_a_refresh_refuses_a_match_it_was_not_asked_about(): void
    {
        $refresh = $this->query()->refreshing([new HitIdentity('tasks.task', 'tasks.task', self::FIRST_ID)]);

        $this->expectException(SearchBatchInvalid::class);

        SearchBatch::refreshed('v2', $refresh, [$this->result(self::SECOND_ID)]);
    }

    public function test_a_refresh_asks_about_at_most_a_batch_of_candidates(): void
    {
        $candidates = array_fill(0, SearchQuery::HIT_LIMIT + 1, new HitIdentity('tasks.task', 'tasks.task', self::FIRST_ID));

        $this->expectException(SearchBatchInvalid::class);

        $this->query()->refreshing($candidates);
    }

    private function result(string $id = self::FIRST_ID, ScoreTier $score = ScoreTier::TitlePrefix): SearchResult
    {
        return new SearchResult('Title', 'Snippet', new RecordIdentity('tasks.task', $id), $score);
    }

    private function query(): SearchQuery
    {
        return new SearchQuery(
            new SearchReader(ActorContext::forAgent(self::FIRST_ID), SearchSurface::AgentTool),
            SearchWords::fromInput('driver'),
            SearchScope::everywhere(),
            'tasks.task',
            10,
            WorkBudget::forBatch(150),
        );
    }
}
