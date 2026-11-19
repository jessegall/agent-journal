<?php

declare(strict_types=1);

namespace App\Agents\Stored;

use App\Agents\Values\ResourceRequest;
use App\Operations\Enums\ResourceAreaType;
use Spatie\LaravelData\Data;

/**
 * One resource of an operation grant as the JSON column holds it.
 */
final class StoredResource extends Data
{
    public function __construct(
        public readonly ResourceAreaType $area,
        public readonly string $target,
    ) {}

    public static function fromResourceRequest(ResourceRequest $resource): self
    {
        return self::from(['area' => $resource->area, 'target' => $resource->target]);
    }

    public function toResourceRequest(): ResourceRequest
    {
        return new ResourceRequest($this->area, $this->target);
    }
}
