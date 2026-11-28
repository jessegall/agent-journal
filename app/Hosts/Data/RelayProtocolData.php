<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class RelayProtocolData extends Data
{
    /**
     * @param  list<string>  $sharedCalls
     * @param  array<string, HostCallData>  $calls
     * @param  array<string, array<string, string>>  $types
     */
    public function __construct(
        public readonly array $sharedCalls,
        #[DataCollectionOf(HostCallData::class)]
        public readonly array $calls,
        public readonly array $types,
    ) {}
}
