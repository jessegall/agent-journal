<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Enums\ExampleType;
use Spatie\LaravelData\Data;

/**
 * One example of a proposal as it is stored, the shape RuleExample::toArray writes: its type, line and classes.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
final class StoredRuleExample extends Data
{
    /**
     * @param  list<string>  $classes
     */
    public function __construct(
        public readonly ExampleType $type,
        public readonly string $line,
        public readonly array $classes,
    ) {}
}
