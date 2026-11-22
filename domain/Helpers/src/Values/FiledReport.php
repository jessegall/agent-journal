<?php

declare(strict_types=1);

namespace Domain\Helpers\Values;

/**
 * A report as its filing names it: its id and its number.
 */
final readonly class FiledReport
{
    public function __construct(
        public string $id,
        public int $number,
    ) {}
}
