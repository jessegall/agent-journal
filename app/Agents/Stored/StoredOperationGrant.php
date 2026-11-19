<?php

declare(strict_types=1);

namespace App\Agents\Stored;

use App\Agents\Values\OperationGrant;
use App\Agents\Values\ResourceRequest;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One operation grant of an access policy as the JSON column holds it.
 */
final class StoredOperationGrant extends Data
{
    /**
     * @param  list<StoredResource>  $resources
     */
    public function __construct(
        public readonly string $operation,
        #[DataCollectionOf(StoredResource::class)]
        public readonly array $resources,
    ) {}

    public static function fromOperationGrant(OperationGrant $grant): self
    {
        return self::from([
            'operation' => $grant->operation,
            'resources' => array_map(StoredResource::fromResourceRequest(...), $grant->resources),
        ]);
    }

    public function toOperationGrant(): OperationGrant
    {
        return new OperationGrant(
            $this->operation,
            array_map(
                fn (StoredResource $resource): ResourceRequest => $resource->toResourceRequest(),
                $this->resources,
            ),
        );
    }
}
