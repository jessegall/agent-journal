<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\PolicyOriginType;

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
