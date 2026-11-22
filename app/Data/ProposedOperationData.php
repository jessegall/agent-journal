<?php

declare(strict_types=1);

namespace App\Data;

use App\Support\OperationRule;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One exact operation a proposed profile is granted, with the resources it asks for, as the proposal writes it.
 */
final class ProposedOperationData extends Data
{
    /**
     * @param  list<ProposedResourceData>  $resources
     */
    public function __construct(
        public readonly string $name,
        #[DataCollectionOf(ProposedResourceData::class)]
        public readonly array $resources = [],
    ) {}

    public function toOperationRule(): OperationRule
    {
        return new OperationRule(
            $this->name,
            array_map(fn (ProposedResourceData $resource) => $resource->toResourceRequest(), $this->resources),
        );
    }
}
