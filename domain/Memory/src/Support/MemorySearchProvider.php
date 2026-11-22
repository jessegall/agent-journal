<?php

declare(strict_types=1);

namespace Domain\Memory\Support;

use App\Contracts\Search\SearchProvider;
use App\Contracts\Search\TieredSearch;
use App\Enums\ScoreTier;
use App\Support\ActorIdentity;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use App\Values\RefreshCandidates;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchResult;
use App\Values\TieredSearchSource;
use Domain\Memory\Models\Memory;

/**
 * Finds the caller's own memories by their words; another actor's memory is never a candidate, whoever asks.
 */
final readonly class MemorySearchProvider implements SearchProvider
{
    public const string RECORD_TYPE = Memory::LINK_TYPE;

    public function __construct(private MemorySearchAccess $access, private TieredSearch $texts) {}

    public function search(SearchQuery|RefreshCandidates $query): SearchBatch
    {
        $owner = ActorIdentity::of($query->reader->actor);

        return $this->texts->search($query, new TieredSearchSource(
            admitted: fn () => self::ownedBy($owner),
            idColumn: 'id',
            titleColumn: 'text',
            columns: ['id', 'number', 'text'],
            titleOf: fn (Memory $memory): string => $memory->text,
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $memoryId): bool => self::ownedBy($owner)->whereKey($memoryId)->exists()
                && $this->access->admitsOpen($query->reader, $memoryId),
            referenceOf: self::noReference(...),
        ));
    }

    /**
     * @return ReadBuilder<Memory>
     */
    private static function ownedBy(ActorIdentity $owner): ReadBuilder
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
            new RecordIdentity(self::RECORD_TYPE, $memory->id),
            $tier,
        );
    }
}
