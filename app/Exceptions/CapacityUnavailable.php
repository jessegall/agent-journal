<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\StartRefusal;
use App\Enums\Sessions\CapacityResource;
use App\Enums\Sessions\StartRefusalType;
use RuntimeException;

/**
 * A required container start the host has no room left for; it is refused rather than overcommitted.
 */
final class CapacityUnavailable extends RuntimeException implements StartRefusal
{
    private function __construct(string $message, public readonly CapacityResource $resource)
    {
        parent::__construct($message);
    }

    public static function because(CapacityResource $resource, string $reason): self
    {
        return new self("The host has no capacity left for this start: {$reason} Nothing was started.", $resource);
    }

    /**
     * The public explanation, naming the resource the start did not fit in.
     */
    public function explanation(): string
    {
        return $this->resource->explanation();
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::CapacityUnavailable;
    }
}
