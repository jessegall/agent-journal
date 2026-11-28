<?php

declare(strict_types=1);

namespace Domain\Memory\Support;

use App\Search\Contracts\SearchProvider;
use App\Search\Contracts\TieredSearch;
use App\Search\Enums\ScoreTier;
use App\Search\Values\RefreshCandidates;
use App\Search\Values\SearchBatch;
use App\Search\Values\SearchQuery;
use App\Search\Values\SearchResult;
use App\Search\Values\TieredSearchSource;
use App\Support\ActorReference;
use App\Support\BoundedReadBuilder;
use App\Support\RecordIdentity;
use Domain\Memory\Models\Memory;

/**
 * Finds the caller's own memories by their words; another actor's memory is never a candidate, whoever asks.
 */
final readonly class MemorySearchProvider implements SearchProvider
{
    public function __construct(private MemorySearchAccess $access, private TieredSearch $texts) {}

    public function search(SearchQuery|RefreshCandidates $query): SearchBatch
    {
        $owner = $query->reader->actor;

        return $this->texts->search($query, new TieredSearchSource(
            admitted: fn () => self::ownedBy($owner),
            idColumn: 'id',
            titleColumn: 'text',
            columns: ['id', 'number', 'text'],
            titleOf: fn (Memory $memory): string => $memory->text,
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $memoryId) => self::ownedBy($owner)->whereKey($memoryId)->exists()
                && $this->access->admitsOpen($query->reader, $memoryId),
            referenceOf: self::noReference(...),
        ));
    }

    /**
     * @return BoundedReadBuilder<Memory>
     */
    private static function ownedBy(ActorReference $owner): BoundedReadBuilder
    {
        return Memory::query()->ownedBy($owner);
    }

    /**
     * A memory is found by its words only: no written reference such as a number names one.
     */
    private static function noReference(): null
    {
        return null;
    }

    private static function hitOf(Memory $memory, ScoreTier $tier): SearchResult
    {
        return SearchResult::shortened(
            "Memory {$memory->number}",
            $memory->text,
            new RecordIdentity(Memory::linkType(), $memory->id),
            $tier,
        );
    }
}
