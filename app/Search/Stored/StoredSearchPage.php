<?php

declare(strict_types=1);

namespace App\Search\Stored;

use App\Search\Enums\SearchStatus;
use App\Search\Values\BufferedHit;
use App\Search\Values\EmittedHit;
use App\Search\Values\SearchAnswer;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One page a search answered, as its stored state keeps it to replay: its status, its hits and the narrower scopes.
 */
final class StoredSearchPage extends Data
{
    /**
     * @param  list<StoredSearchHit>  $hits
     * @param  list<string>  $narrower
     */
    public function __construct(
        public readonly SearchStatus $status,
        #[DataCollectionOf(StoredSearchHit::class)]
        public readonly array $hits,
        public readonly array $narrower,
    ) {}

    /**
     * The page an answer showed, kept so a retained position replays the same hits.
     */
    public static function fromAnswer(SearchAnswer $answer): self
    {
        $stored = fn (EmittedHit $hit) => StoredSearchHit::fromBufferedHit(
            new BufferedHit($hit->identity(), $hit->score),
        );

        return self::from([
            'status' => $answer->status,
            'hits' => array_map($stored, $answer->hits),
            'narrower' => $answer->narrowerScopes,
        ]);
    }
}
