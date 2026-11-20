<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * A grant of one exact host operation, limited to the operands it lists; with none listed, wherever the policy's
 * scopes would otherwise allow it.
 */
final readonly class OperationGrant
{
    /**
     * @param  list<ResourceRequest>  $resources
     */
    public function __construct(
        public string $operation,
        public array $resources,
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
