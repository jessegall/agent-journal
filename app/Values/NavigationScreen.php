<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Data;

/**
 * A stable screen as the host sent it: its redacted rows, the highlighted row when a list is drawn, and the screen
 * generation a round must answer.
 */
final class NavigationScreen extends Data
{
    /**
     * @param  list<string>  $rows
     */
    public function __construct(
        public readonly array $rows,
        public readonly int|null $highlight,
        public readonly int $generation,
    ) {}

}
