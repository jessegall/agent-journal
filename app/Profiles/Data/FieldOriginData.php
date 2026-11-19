<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Values\FieldOrigin;
use Spatie\LaravelData\Data;

/**
 * Where one effective field of a profile's start policy came from, as a revision's provenance column holds it.
 */
final class FieldOriginData extends Data
{
    public function __construct(
        public readonly string $field,
        public readonly PolicyOriginType $origin,
    ) {}

    public static function fromFieldOrigin(FieldOrigin $origin): self
    {
        return new self($origin->field, $origin->origin);
    }

    public function toFieldOrigin(): FieldOrigin
    {
        return new FieldOrigin($this->field, $this->origin);
    }
}
