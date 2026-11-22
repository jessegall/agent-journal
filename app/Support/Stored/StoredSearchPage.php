<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Enums\SearchStatus;
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
}
