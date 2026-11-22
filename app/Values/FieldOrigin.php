<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\PolicyOriginType;

/**
 * Where one effective field of a profile's start policy came from.
 */
final readonly class FieldOrigin
{
    public function __construct(
        public string $field,
        public PolicyOriginType $origin,
    ) {}
}
