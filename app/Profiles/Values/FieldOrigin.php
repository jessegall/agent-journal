<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\PolicyOriginType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Where one effective field of a profile's start policy came from.
 */
#[MapName(SnakeCaseMapper::class)]
final class FieldOrigin extends Data
{
    public function __construct(
        public readonly string $field,
        public readonly PolicyOriginType $origin,
    ) {}
}
