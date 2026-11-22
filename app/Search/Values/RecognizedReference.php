<?php

declare(strict_types=1);

namespace App\Search\Values;

/**
 * A complete reference a source recognized in the whole input, such as task 2241: the number it names and the
 * reference as the source writes it.
 */
final readonly class RecognizedReference
{
    public function __construct(
        public int $number,
        public string $display,
    ) {}
}
