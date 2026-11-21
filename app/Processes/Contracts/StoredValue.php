<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;

/**
 * A typed value a Processes model stores as JSON and reads back as the same value, never as an untyped array: each
 * reads its JSON through the Data class that writes its stored shape down.
 */
interface StoredValue
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(): array;

    /**
     * The value its stored JSON holds, the shape toArray writes.
     *
     * @throws JsonException|CannotCreateData
     */
    public static function fromJson(string $json): static;

    /**
     * The values a stored JSON list holds, each in the shape toArray writes.
     *
     * @return list<static>
     *
     * @throws JsonException|CannotCreateData
     */
    public static function listFromJson(string $json): array;
}
