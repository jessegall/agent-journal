<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\PolicyOriginType;
use Spatie\LaravelData\Data;

/**
 * Where one effective field of a profile's start policy came from.
 */
final class FieldOrigin extends Data
{
    public function __construct(
        public readonly string $field,
        public readonly PolicyOriginType $origin,
    ) {}
}
