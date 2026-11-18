<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Operations\Enums\ResourceAreaType;

/**
 * One resource an operation acts on: its area and the path or destination in it, in canonical form.
 */
final readonly class ResourceRequest
{
    public function __construct(
        public ResourceAreaType $area,
        public string $target,
    ) {}
}
