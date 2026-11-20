<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Values;

use Spatie\LaravelData\Attributes\Validation\Max;

/**
 * A value a command carries, wrongly declaring a limit on its own property.
 */
final readonly class RuledLabel
{
    public function __construct(
        #[Max(5)]
        public string $text,
    ) {}
}
