<?php

declare(strict_types=1);

namespace App\Data;

use App\Support\PoolReference;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The JSON pool column of an auto-assignment: the pool's type, the record it belongs to, if any, and its record ids.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class StoredPoolData extends Data
{
    /**
     * @param  list<string>  $recordIds
     */
    public function __construct(
        public readonly string $type,
        public readonly RecordIdentityData|null $target,
        public readonly array $recordIds,
    ) {}

    public function pool(): PoolReference
    {
        return new PoolReference($this->type, $this->target?->identity(), $this->recordIds);
    }
}
