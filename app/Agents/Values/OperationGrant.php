<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * A grant of one exact operation, limited to the resources it lists; with none listed, wherever its class grants
 * would otherwise allow it.
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
            fn (ResourceRequest $resource): bool => in_array($resource, $this->resources),
        );
    }
}
