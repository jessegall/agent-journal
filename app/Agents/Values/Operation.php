<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Operations\Enums\AccessType;

/**
 * One operation as a trusted adapter or owner declares it: where it comes from, its stable name, every access it
 * needs, the resources it acts on, its argument facts and the revision of its declaration.
 */
final readonly class Operation
{
    /**
     * @param  list<AccessType>  $accessTypes
     * @param  list<ResourceRequest>  $resources
     * @param  list<string>  $arguments
     */
    public function __construct(
        public string $surface,
        public string $name,
        public array $accessTypes,
        public array $resources,
        public array $arguments,
        public int $declarationRevision,
    ) {}
}
