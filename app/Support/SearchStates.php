<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\SearchHandleRefused;
use App\Exceptions\SearchRestartRequired;
use App\Exceptions\SearchStateFull;
use App\Exceptions\SearchStoreLocksMissing;
use App\Support\Stored\StoredSearch;
use App\Support\Stored\StoredSearchPosition;
use App\Values\SearchOwner;
use App\Values\SearchPosition;
use Illuminate\Cache\CacheManager;
use Illuminate\Contracts\Cache\LockProvider;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Contracts\Encryption\Encrypter;

/**
 * The private state of running searches behind opaque handles. A handle names a search and one retained position
 * and is signed over its owner's binding, so a foreign or changed handle is refused without a word of the search,
 * while the owner's handle of a gone search answers restart. Each search lives ten minutes and holds at most
 * 64 KiB; a principal keeps eight active searches per environment, the oldest set aside for a ninth.
 */
final readonly class SearchStates
{
    public const int LIFETIME_SECONDS = 600;

    public const int ACTIVE_SEARCH_LIMIT = 8;

    public const int STATE_BYTE_LIMIT = 65_536;

    public const int RETAINED_POSITION_LIMIT = 32;

    private const string PURPOSE = 'journal-search-state';

    private const int LOCK_SECONDS = 5;

    private const int LOCK_WAIT_SECONDS = 3;

    private Repository $cache;

    private LockProvider $locks;

    /**
     * @throws SearchStoreLocksMissing
     */
    public function __construct(CacheManager $caches, private Encrypter $encrypter)
    {
        $this->cache = $caches->store();
        $store = $this->cache->getStore();

        if (! $store instanceof LockProvider) {
            throw SearchStoreLocksMissing::for($store::class);
        }

        $this->locks = $store;
    }

    /**
     * Starts a search for its owner with the state its first page left, and answers the handle of that position.
     *
     * @throws SearchStateFull
     */
    public function start(SearchOwner $owner, string $state): string
    {
        $searchId = self::randomId();
        $positionId = self::randomId();
        $stored = StoredSearch::starting(self::ownerHash($owner), $positionId, $state);

        self::assertFits($stored);

        $this->locks->lock(self::principalKey($owner), self::LOCK_SECONDS)->block(
            self::LOCK_WAIT_SECONDS,
            function () use ($owner, $searchId, $stored): void {
                $this->admitActive($owner, $searchId);
                $this->cache->put(self::searchKey($searchId), $stored, self::LIFETIME_SECONDS);
            },
        );

        return $this->handleOf($owner, $searchId, $positionId);
    }

    /**
     * The retained position a handle names, with the page it produced when it was resumed before.
     *
     * @throws SearchHandleRefused
     * @throws SearchRestartRequired
     */
    public function resume(SearchOwner $owner, string $handle): SearchPosition
    {
        [$searchId, $positionId] = $this->opened($owner, $handle);
        $position = $this->stored($owner, $searchId)->position($positionId);

        return $this->positionOf($owner, $searchId, $positionId, $position);
    }

    /**
     * Records the page a position produced and the state its successor starts from, atomically: a position resumed
     * twice keeps the page and successor it was first given, so a concurrent retry gets that same page back.
     *
     * @throws SearchHandleRefused
     * @throws SearchRestartRequired
     * @throws SearchStateFull
     */
    public function advance(SearchOwner $owner, string $handle, string $page, string $successorState): SearchPosition
    {
        [$searchId, $positionId] = $this->opened($owner, $handle);

        return $this->locks->lock(self::searchKey($searchId).':lock', self::LOCK_SECONDS)->block(
            self::LOCK_WAIT_SECONDS,
            fn () => $this->advanceLocked($owner, $searchId, $positionId, $page, $successorState),
        );
    }

    /**
     * Ends a search, so every handle of it answers restart.
     *
     * @throws SearchHandleRefused
     */
    public function finish(SearchOwner $owner, string $handle): void
    {
        [$searchId] = $this->opened($owner, $handle);

        $this->cache->forget(self::searchKey($searchId));
    }

    private function advanceLocked(
        SearchOwner $owner,
        string $searchId,
        string $positionId,
        string $page,
        string $successorState,
    ): SearchPosition {
        $stored = $this->stored($owner, $searchId);
        $position = $stored->position($positionId);
        $current = $this->positionOf($owner, $searchId, $positionId, $position);

        if ($current->wasResumed()) {
            return $current;
        }

        $successorId = self::randomId();
        $advanced = $stored->advanced($positionId, $page, $successorId, $successorState, self::RETAINED_POSITION_LIMIT);

        self::assertFits($advanced);
        $this->cache->put(self::searchKey($searchId), $advanced, self::LIFETIME_SECONDS);

        return new SearchPosition(
            $this->handleOf($owner, $searchId, $positionId),
            $position->state,
            $page,
            $this->handleOf($owner, $searchId, $successorId),
        );
    }

    private function positionOf(
        SearchOwner $owner,
        string $searchId,
        string $positionId,
        StoredSearchPosition $position,
    ): SearchPosition {
        $successor = $position->successor;

        return new SearchPosition(
            $this->handleOf($owner, $searchId, $positionId),
            $position->state,
            $position->page,
            $successor === null ? null : $this->handleOf($owner, $searchId, $successor),
        );
    }

    /**
     * Keeps the principal's active searches at the limit, setting the oldest aside to make room for this one.
     */
    private function admitActive(SearchOwner $owner, string $searchId): void
    {
        $active = $this->cache->get(self::principalKey($owner), []);

        $active = array_values(array_filter(
            is_array($active) ? $active : [],
            fn (mixed $id) => is_string($id) && $this->cache->has(self::searchKey($id)),
        ));

        while (count($active) >= self::ACTIVE_SEARCH_LIMIT) {
            $this->cache->forget(self::searchKey(array_shift($active)));
        }

        $active[] = $searchId;
        $this->cache->put(self::principalKey($owner), $active, self::LIFETIME_SECONDS);
    }

    /**
     * The search and position ids of a handle signed for this owner.
     *
     * @return array{0: string, 1: string}
     *
     * @throws SearchHandleRefused
     */
    private function opened(SearchOwner $owner, string $handle): array
    {
        $parts = explode('.', $handle);

        if (count($parts) !== 3) {
            throw SearchHandleRefused::make();
        }

        [$searchId, $positionId, $signature] = $parts;

        if (! hash_equals($this->signatureOf($owner, $searchId, $positionId), $signature)) {
            throw SearchHandleRefused::make();
        }

        return [
            $searchId,
            $positionId,
        ];
    }

    /**
     * @throws SearchRestartRequired
     */
    private function stored(SearchOwner $owner, string $searchId): StoredSearch
    {
        $stored = $this->cache->get(self::searchKey($searchId));

        if (! $stored instanceof StoredSearch || ! $stored->isOwnedBy(self::ownerHash($owner))) {
            throw SearchRestartRequired::expired();
        }

        return $stored;
    }

    private static function ownerHash(SearchOwner $owner): string
    {
        return hash('sha256', $owner->binding());
    }

    private function handleOf(SearchOwner $owner, string $searchId, string $positionId): string
    {
        return "{$searchId}.{$positionId}.".$this->signatureOf($owner, $searchId, $positionId);
    }

    private function signatureOf(SearchOwner $owner, string $searchId, string $positionId): string
    {
        $signed = implode("\n", [
            self::PURPOSE,
            $owner->binding(),
            $searchId,
            $positionId,
        ]);

        return bin2hex(hash_hmac('sha256', $signed, $this->encrypter->getKey(), true));
    }

    /**
     * @throws SearchStateFull
     */
    private static function assertFits(StoredSearch $stored): void
    {
        if (strlen(serialize($stored)) > self::STATE_BYTE_LIMIT) {
            throw SearchStateFull::over(self::STATE_BYTE_LIMIT);
        }
    }

    private static function searchKey(string $searchId): string
    {
        return "search-state:{$searchId}";
    }

    private static function principalKey(SearchOwner $owner): string
    {
        return "search-states:{$owner->principal()}";
    }

    private static function randomId(): string
    {
        return bin2hex(random_bytes(16));
    }
}
