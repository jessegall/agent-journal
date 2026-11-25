<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Enums\ResourceType;
use App\Values\ResourceRequest;
use Spatie\LaravelData\Data;

/**
 * One operand of an operation grant as the JSON column holds it.
 */
final class StoredResource extends Data
{
    public function __construct(
        public readonly ResourceType $type,
        public readonly string $target,
    ) {}

    public static function fromResourceRequest(ResourceRequest $resource): self
    {
        return self::from([
            'type' => $resource->type,
            'target' => $resource->target,
        ]);
    }

    public function toResourceRequest(): ResourceRequest
    {
        return new ResourceRequest($this->type, $this->target);
    }
}
