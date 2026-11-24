<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\AccessType;

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

    /**
     * Whether the operation only reads: it reads, searches or fetches, and changes nothing.
     */
    public function readsOnly(): bool
    {
        return $this->accessTypes !== [] && array_all(
            $this->accessTypes,
            fn (AccessType $type) => in_array($type, [AccessType::Read, AccessType::Search, AccessType::Network], true),
        );
    }
}
