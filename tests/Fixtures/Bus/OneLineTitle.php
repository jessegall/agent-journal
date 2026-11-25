<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus;

use App\Attributes\Validation\OneLine;
use Spatie\LaravelData\Data;

/**
 * A title that must be one line, for the OneLine attribute's tests.
 */
final class OneLineTitle extends Data
{
    public function __construct(
        #[OneLine]
        public readonly string $title,
    ) {}
}
