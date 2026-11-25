<?php

declare(strict_types=1);

namespace Tests\Feature\Search;

use App\Enums\Search\SearchSurface;
use App\Exceptions\SearchHandleRefused;
use App\Exceptions\SearchRestartRequired;
use App\Exceptions\SearchStateFull;
use App\Support\ActorIdentity;
use App\Support\SearchStates;
use App\Values\SearchOwner;
use Tests\TestCase;

/**
 * Search handles open only for their owner, a retained position replays its page, a set-aside search answers
 * restart, and a principal keeps at most eight active searches per environment.
 */
final class SearchStatesTest extends TestCase
{
    private const string OWNER_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAA';

    private const string OTHER_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAB';

    public function test_another_agents_handle_is_refused_while_the_owner_resumes(): void
    {
        $states = $this->app->make(SearchStates::class);
        $handle = $states->start(self::owner(self::OWNER_ID), 'first-state');

        try {
            $states->resume(self::owner(self::OTHER_ID), $handle);
            $this->fail('Another agent opened the handle.');
        } catch (SearchHandleRefused $refusal) {
            $this->assertStringNotContainsString('first-state', $refusal->getMessage());
        }

        $this->assertSame('first-state', $states->resume(self::owner(self::OWNER_ID), $handle)->state);
    }

    public function test_a_search_resumes_from_a_cache_that_serializes_what_it_keeps(): void
    {
        $this->app->make('config')->set('cache.stores.array.serialize', true);
        $this->app->make('cache')->forgetDriver('array');
        $states = $this->app->make(SearchStates::class);
        $owner = self::owner(self::OWNER_ID);
        $handle = $states->start($owner, 'first-state');

        $successor = $states->advance($owner, $handle, 'first-page', 'second-state')->successor;

        $this->assertNotNull($successor);
        $this->assertSame('first-page', $states->resume($owner, $handle)->page);
        $this->assertSame('second-state', $states->resume($owner, $successor)->state);
    }

    public function test_a_changed_handle_is_refused(): void
    {
        $states = $this->app->make(SearchStates::class);
        $handle = $states->start(self::owner(self::OWNER_ID), 'state');

        $this->expectException(SearchHandleRefused::class);

        $changed = substr($handle, 0, -1).(str_ends_with($handle, '0') ? '1' : '0');

        $states->resume(self::owner(self::OWNER_ID), $changed);
    }

    public function test_a_handle_from_another_surface_or_session_is_refused(): void
    {
        $states = $this->app->make(SearchStates::class);
        $handle = $states->start(self::owner(self::OWNER_ID), 'state');
        $agent = ActorIdentity::forAgent(self::OWNER_ID);
        $palette = new SearchOwner('session', $agent, 'main', 'search', SearchSurface::Palette);

        $this->expectException(SearchHandleRefused::class);

        $states->resume($palette, $handle);
    }

    public function test_a_retained_position_replays_the_same_page(): void
    {
        $states = $this->app->make(SearchStates::class);
        $owner = self::owner(self::OWNER_ID);
        $handle = $states->start($owner, 'first-state');

        $first = $states->advance($owner, $handle, 'page-one', 'second-state');
        $retry = $states->advance($owner, $handle, 'page-other', 'other-state');

        $this->assertSame('page-one', $retry->page);
        $this->assertSame($first->successor, $retry->successor);
        $this->assertTrue($states->resume($owner, $handle)->wasResumed());
        $this->assertSame('second-state', $states->resume($owner, (string) $first->successor)->state);
    }

    public function test_an_evicted_unexpired_search_answers_restart_and_a_ninth_search_sets_the_oldest_aside(): void
    {
        $states = $this->app->make(SearchStates::class);
        $owner = self::owner(self::OWNER_ID);
        $oldest = $states->start($owner, 'state-0');

        foreach (range(1, SearchStates::ACTIVE_SEARCH_LIMIT) as $index) {
            $states->start($owner, "state-{$index}");
        }

        try {
            $states->resume($owner, $oldest);
            $this->fail('The oldest of nine searches was still active.');
        } catch (SearchRestartRequired) {
            $this->addToAssertionCount(1);
        }

        $other = $states->start(self::owner(self::OTHER_ID), 'other');
        $this->assertSame('other', $states->resume(self::owner(self::OTHER_ID), $other)->state);
    }

    public function test_an_expired_search_answers_restart(): void
    {
        $states = $this->app->make(SearchStates::class);
        $owner = self::owner(self::OWNER_ID);
        $handle = $states->start($owner, 'state');

        $this->travel(SearchStates::LIFETIME_SECONDS + 1)->seconds();

        $this->expectException(SearchRestartRequired::class);
        $states->resume($owner, $handle);
    }

    public function test_state_over_64_kib_is_refused_before_it_is_stored(): void
    {
        $states = $this->app->make(SearchStates::class);

        $this->expectException(SearchStateFull::class);

        $states->start(self::owner(self::OWNER_ID), str_repeat('x', SearchStates::STATE_BYTE_LIMIT));
    }

    private static function owner(string $agentId): SearchOwner
    {
        return new SearchOwner('session', ActorIdentity::forAgent($agentId), 'main', 'search', SearchSurface::AgentTool);
    }
}
