<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Agents\Values\ResourceRequest;
use App\Operations\Enums\ResourceAreaType;
use Spatie\LaravelData\Data;

/**
 * One resource an operation of a proposed profile asks for, as the proposal writes it.
 */
final class ProposedResourceData extends Data
{
    public function __construct(
        public readonly string $area,
        public readonly string $target,
    ) {}

    public function toResourceRequest(): ResourceRequest
    {
        return new ResourceRequest(ResourceAreaType::from($this->area), $this->target);
    }
}
