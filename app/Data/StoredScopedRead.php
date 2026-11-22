<?php

declare(strict_types=1);

namespace App\Data;

use App\Values\ScopedRead;
use Spatie\LaravelData\Data;

/**
 * One stored named read: the read's name and the one target it covers, or none for every target.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
final class StoredScopedRead extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly string|null $target = null,
    ) {}

    public function read(): ScopedRead
    {
        return new ScopedRead($this->name, $this->target);
    }
}
