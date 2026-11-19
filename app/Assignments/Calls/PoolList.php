<?php

declare(strict_types=1);

namespace App\Assignments\Calls;

use App\Http\Data\Assignments\PoolDefinitionData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The pools an auto-assignment of one kind of record can take from.
 */
final class PoolList extends Data
{
    /**
     * @param  list<PoolDefinitionData>  $pools
     */
    public function __construct(
        #[DataCollectionOf(PoolDefinitionData::class)]
        public array $pools,
    ) {}
}
