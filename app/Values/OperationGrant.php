<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * A grant of one exact host operation, limited to the operands it lists; with none listed, wherever the policy's
 * scopes would otherwise allow it.
 */
final class OperationGrant extends Data
{
    /**
     * @param  list<ResourceRequest>  $resources
     */
    public function __construct(
        public readonly string $operation,
        #[DataCollectionOf(ResourceRequest::class)]
        public readonly array $resources,
    ) {}

    public function covers(Operation $operation): bool
    {
        if ($operation->name !== $this->operation) {
            return false;
        }

        return $this->resources === [] || array_all(
            $operation->resources,
            fn (ResourceRequest $resource): bool => array_any(
                $this->resources,
                fn (ResourceRequest $granted) => $granted->type === $resource->type
                    && $granted->normalizedPath() === $resource->normalizedPath(),
            ),
        );
    }
}
