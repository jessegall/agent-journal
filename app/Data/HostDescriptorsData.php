<?php

declare(strict_types=1);

namespace App\Data;

use App\Values\HostDescriptor;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * What a host reports at its start: the host protocol it speaks and every driver registration it advertises.
 */
final class HostDescriptorsData extends Data
{
    /**
     * @param  list<HostDescriptorData>  $descriptors
     */
    public function __construct(
        public readonly int $protocolVersion,
        #[DataCollectionOf(HostDescriptorData::class)]
        public readonly array $descriptors,
    ) {}

    /**
     * @return list<HostDescriptor>
     */
    public function descriptors(): array
    {
        return array_map(fn (HostDescriptorData $descriptor) => $descriptor->descriptor(), $this->descriptors);
    }
}
