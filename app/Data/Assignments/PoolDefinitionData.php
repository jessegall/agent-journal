<?php

declare(strict_types=1);

namespace App\Data\Assignments;

use App\Support\PoolDefinition;
use Spatie\LaravelData\Data;

/**
 * One pool a record type may be drawn from: the key to choose it by, and its label.
 */
final class PoolDefinitionData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $label,
    ) {}

    public static function of(PoolDefinition $pool): self
    {
        return new self($pool->key, $pool->label);
    }
}
