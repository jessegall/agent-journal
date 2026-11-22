<?php

declare(strict_types=1);

namespace Tests\Feature\Search;

use App\Contracts\ReadGrant;
use App\Enums\ScoreTier;
use App\Enums\SearchStatus;
use App\Enums\SearchSurface;
use App\Support\ActorContext;
use App\Support\RecordIdentity;
use App\Support\Searchable;
use App\Support\SearchablesRegistry;
use App\Support\SearchCoordinator;
use App\Support\SearchEligibility;
use App\Support\SearchStates;
use App\Values\SearchAnswer;
use App\Values\SearchBatch;
use App\Values\SearchOwner;
use App\Values\SearchQuery;
use App\Values\SearchReader;
use App\Values\SearchRequest;
use App\Values\SearchResult;
use App\Values\SourcePosition;
use Closure;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Search\MutableReadGrant;
use Tests\Fixtures\Search\OpenSearchAccess;
use Tests\Fixtures\Search\SwitchedOffDomains;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A complete reference reaches its task in one search plus one open while a ninth source hangs; a source that
 * times out twice ends the search as incomplete with narrower scopes; a buffered task revoked between calls
 * vanishes on resume.
 */
#[TimeLimit(10, 'The hanging fixture source sleeps past its deadline on purpose in several calls.')]
final class SearchCoordinatorTest extends TestCase
{
    private const string AGENT_ID = '01ARZ3NDEKTSV4RRFFQ69G5FZZ';

    private const string NOTE_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAA';

    public function test_a_task_reference_is_reached_in_one_search_and_one_open_beside_a_hanging_source(): void
    {
        $task = Task::factory()->create(['title' => 'Search through everything']);
        $grant = new MutableReadGrant([$task->id]);
        $coordinator = $this->coordinator($grant, $this->eightFastSourcesAndOneHanging());

        $request = SearchRequest::parse(query: "task {$task->number}");
        $answer = $coordinator->search(self::owner(), self::agent(), $request);

        $this->assertNotNull($answer->directOpen);
        $this->assertSame('tasks_read', $answer->directOpen->open->tool);
        $this->assertSame(['task_id' => $task->id], $answer->directOpen->open->arguments);
        $this->assertSame('tasks.task', $answer->directOpen->sourceKey);
        $this->assertSame(ScoreTier::Reference, $answer->directOpen->score);
        $this->assertNotNull($answer->continuation);
    }

    public function test_a_denied_reference_answers_as_an_ordinary_search(): void
    {
        $task = Task::factory()->create(['title' => 'Search through everything']);
        $coordinator = $this->coordinator(new MutableReadGrant([self::NOTE_ID]), ['notes' => [$this->fast('note')]]);

        $request = SearchRequest::parse(query: "task {$task->number}");
        $answer = $coordinator->search(self::owner(), self::agent(), $request);

        $this->assertNull($answer->directOpen);
        $this->assertSame([], array_filter($answer->hits, fn ($hit) => $hit->reference->id === $task->id));
    }

    public function test_a_first_timeout_is_retryable_and_a_second_ends_incomplete_with_narrower_scopes(): void
    {
        $coordinator = $this->coordinator(new MutableReadGrant([self::NOTE_ID]), [
            'notes' => [$this->fast('note')],
            'slow' => [$this->hanging()],
        ]);

        $first = $coordinator->search(self::owner(), self::agent(), SearchRequest::parse(query: 'driver'));

        $this->assertSame(SearchStatus::Retryable, $first->status);
        $this->assertNotNull($first->continuation);

        $second = $this->resume($coordinator, $first);

        $this->assertSame(SearchStatus::Incomplete, $second->status);
        $this->assertNull($second->continuation);
        $this->assertSame(['notes.note'], $second->narrowerScopes);
    }

    public function test_a_revoked_buffered_task_vanishes_on_resume(): void
    {
        $first = Task::factory()->create(['id' => '01arz3ndektsv4rrffq69g0001', 'title' => 'Driver']);
        $second = Task::factory()->create(['id' => '01arz3ndektsv4rrffq69g0002', 'title' => 'Driver']);
        $grant = new MutableReadGrant([$first->id, $second->id]);
        $coordinator = $this->coordinator($grant, []);

        $page = $coordinator->search(
            self::owner(),
            self::agent(),
            SearchRequest::parse(query: 'driver', within: 'tasks.task', limit: 1),
        );

        $this->assertSame([$first->id], array_map(fn ($hit) => $hit->reference->id, $page->hits));
        $this->assertSame(SearchStatus::More, $page->status);

        $grant->revoke($second->id);
        $next = $this->resume($coordinator, $page);

        $this->assertSame([], $next->hits);
        $this->assertSame(SearchStatus::Complete, $next->status);
    }

    public function test_a_replayed_position_returns_the_same_page(): void
    {
        foreach (range(1, 3) as $index) {
            Task::factory()->create(['id' => '01arz3ndektsv4rrffq69g000'.$index, 'title' => 'Driver']);
        }

        $grant = new MutableReadGrant(array_map(fn (int $index) => '01arz3ndektsv4rrffq69g000'.$index, range(1, 3)));
        $coordinator = $this->coordinator($grant, []);
        $first = $coordinator->search(
            self::owner(),
            self::agent(),
            SearchRequest::parse(query: 'driver', within: 'tasks.task', limit: 1),
        );

        $second = $this->resume($coordinator, $first);
        $replayed = $this->resume($coordinator, $first);

        $this->assertSame(['01arz3ndektsv4rrffq69g0002'], array_map(fn ($hit) => $hit->reference->id, $second->hits));
        $this->assertSame(
            array_map(fn ($hit) => $hit->reference->id, $second->hits),
            array_map(fn ($hit) => $hit->reference->id, $replayed->hits),
        );
        $this->assertSame($second->continuation, $replayed->continuation);
    }

    private function resume(SearchCoordinator $coordinator, SearchAnswer $answer): SearchAnswer
    {
        $this->assertNotNull($answer->continuation);

        return $coordinator->search(
            self::owner(),
            self::agent(),
            SearchRequest::parse(continuation: $answer->continuation),
        );
    }

    /**
     * @param  array<string, list<Searchable>>  $fixtures
     */
    private function coordinator(MutableReadGrant $grant, array $fixtures): SearchCoordinator
    {
        $this->app->instance(ReadGrant::class, $grant);
        $declarations = ['Tasks' => new TasksDomain()->searchables(), ...$fixtures];

        $eligibility = new SearchEligibility(
            SearchablesRegistry::publishing($declarations),
            new SwitchedOffDomains(),
            $grant,
            $this->app,
        );

        return new SearchCoordinator($eligibility, $this->app->make(SearchStates::class), $this->app);
    }

    /**
     * @return array<string, list<Searchable>>
     */
    private function eightFastSourcesAndOneHanging(): array
    {
        $fixtures = [];

        foreach (range(1, 8) as $index) {
            $fixtures["fast{$index}"] = [$this->fast('note')];
        }

        $fixtures['slow'] = [$this->hanging()];

        return $fixtures;
    }

    private function fast(string $key): Searchable
    {
        return Searchable::make($key, ucfirst($key).'s', OpenSearchAccess::class, $this->oneHit());
    }

    private function hanging(): Searchable
    {
        return Searchable::make('hang', 'Hanging', OpenSearchAccess::class, function (SearchQuery $query): SearchBatch {
            usleep((SearchCoordinator::SOURCE_MILLISECONDS + 50) * 1000);

            return SearchBatch::scanning('1', SourcePosition::of(['step' => 1]));
        });
    }

    private function oneHit(): Closure
    {
        return fn (SearchQuery $query): SearchBatch => SearchBatch::exhausted('1', [
            new SearchResult(
                'Driver notes',
                'Driver notes',
                new RecordIdentity('fixtures.note', self::NOTE_ID),
                ScoreTier::TitlePrefix,
            ),
        ]);
    }

    private static function owner(): SearchOwner
    {
        $agent = ActorContext::forAgent(self::AGENT_ID);

        return new SearchOwner('session', $agent, 'main', 'search', SearchSurface::AgentTool);
    }

    private static function agent(): SearchReader
    {
        return new SearchReader(ActorContext::forAgent(self::AGENT_ID), SearchSurface::AgentTool);
    }
}
