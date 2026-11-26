<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Profiles\Enums\ResourceType;
use App\Values\ResourceRequest;
use Spatie\LaravelData\Data;

/**
 * One resource an operation of a proposed profile asks for, as the proposal writes it.
 */
final class ProposedResourceData extends Data
{
    public function __construct(
        public readonly ResourceType $type,
        public readonly string $target,
    ) {}

    public function toResourceRequest(): ResourceRequest
    {
        return new ResourceRequest($this->type, $this->target);
    }
}
