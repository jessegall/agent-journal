<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Values\NavigationScreen;
use Spatie\LaravelData\Data;

/**
 * A navigation screen as its JSON column stores it: its rows, the highlighted row and the screen generation.
 */
final class StoredNavigationScreen extends Data
{
    /**
     * @param  list<string>  $rows
     */
    public function __construct(
        public readonly array $rows,
        public readonly int|null $highlight,
        public readonly int $generation,
    ) {}

    public function screen(): NavigationScreen
    {
        return new NavigationScreen($this->rows, $this->highlight, $this->generation);
    }
}
