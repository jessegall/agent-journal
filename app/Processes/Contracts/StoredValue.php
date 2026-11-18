<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

/**
 * A typed value a Processes model stores as JSON and reads back as the same value, never as an untyped array.
 */
interface StoredValue
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(): array;

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): static;
}
