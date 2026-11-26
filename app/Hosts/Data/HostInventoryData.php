<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Everything a host holds when it starts: its protocol and release, the newest order whose answer it had recorded when
 * it built the list, and its processes.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HostInventoryData extends Data
{
    /**
     * @param  list<string>  $capabilities  the order types the host carries out
     * @param  list<InventoryProcessData>  $processes
     */
    public function __construct(
        public readonly string $release,
        public readonly string|null $answeredThrough,
        // A host built before protocol 1 sends no protocol field: it speaks protocol 0.
        public readonly int $protocol = 0,
        public readonly array $capabilities = [],
        #[DataCollectionOf(InventoryProcessData::class)]
        public readonly array $processes = [],
    ) {}
}
