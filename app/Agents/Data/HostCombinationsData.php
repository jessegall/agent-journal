<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Values\HostCombination;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The protocol version a host speaks and the combinations it can run, as journal-agent sends them when it starts
 * serving (client.HostCombinations).
 */
final class HostCombinationsData extends Data
{
    /**
     * @param  list<HostCombinationData>  $combinations
     */
    public function __construct(
        public readonly int $protocolVersion,
        #[DataCollectionOf(HostCombinationData::class)]
        public readonly array $combinations,
    ) {}

    /**
     * @return list<HostCombination>
     */
    public function combinations(): array
    {
        return array_map(
            fn (HostCombinationData $combination) => new HostCombination(
                $combination->driver,
                $combination->build,
                $combination->arrangement,
                $combination->placement,
                $combination->variant,
            ),
            $this->combinations,
        );
    }
}
