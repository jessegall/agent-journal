<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Feature;

use App\Enums\Search\SearchSurface;
use App\Models\Access\User;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Values\SearchQuery;
use App\Values\SearchReader;
use App\Values\SearchResult;
use App\Values\SearchScope;
use App\Values\SearchWords;
use App\Values\WorkAllowance;
use Domain\Memory\Models\Memory;
use Domain\Memory\Support\MemorySearchProvider;
use Domain\Memory\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * Memories are a private search source: an actor finds its own memory by its words and never another actor's,
 * however well that one matches.
 */
final class MemorySearchProviderTest extends TestCase
{
    use RefreshHookDatabase;

    private const string OWNER_ID = '01ARZ3NDEKTSV4RRFFQ69G5FA1';

    private const string OTHER_ID = '01ARZ3NDEKTSV4RRFFQ69G5FA2';

    private const string WORDS = 'deploy the relay';

    private const int CALL_LIMIT = 10;

    public function test_an_actor_finds_its_own_memory_by_its_words_and_never_another_actors(): void
    {
        $own = Memory::create(
            ActorIdentity::ofClass(User::class, self::OWNER_ID),
            self::WORDS.' after the tests pass',
            5,
        );

        Memory::create(ActorIdentity::ofClass(User::class, self::OTHER_ID), self::WORDS.' tonight', 5);

        $ownerFinds = $this->search(self::OWNER_ID);
        $strangerFinds = $this->search('01ARZ3NDEKTSV4RRFFQ69G5FA3');

        $this->assertSame([[
            Memory::linkType(),
            $own->id,
        ]], self::references($ownerFinds));
        $this->assertSame([], self::references($strangerFinds));
    }

    /**
     * Every hit the user's search finds, calling again while the source still has blocks or results to give.
     *
     * @return list<SearchResult>
     */
    private function search(string $userId): array
    {
        $provider = $this->app->make(MemorySearchProvider::class);

        $query = new SearchQuery(
            new SearchReader(ActorContext::forUser($userId), SearchSurface::Palette),
            SearchWords::fromInput(self::WORDS),
            SearchScope::within(Memory::linkType()),
            Memory::linkType(),
            10,
            WorkAllowance::forBatch(150),
            null,
        );

        $hits = [];

        for ($call = 0; $call < self::CALL_LIMIT; $call++) {
            $batch = $provider->search($query);
            $hits = [...$hits, ...$batch->hits];
            $next = $batch->outcome->nextPosition();

            if ($next === null) {
                return $hits;
            }

            $query = $query->from($next);
        }

        $this->fail('the memory search did not end within '.self::CALL_LIMIT.' calls');
    }

    /**
     * @param  list<SearchResult>  $hits
     * @return list<array{string, string}>
     */
    private static function references(array $hits): array
    {
        return array_map(fn (SearchResult $hit) => [
            $hit->reference->type,
            $hit->reference->id,
        ], $hits);
    }
}
