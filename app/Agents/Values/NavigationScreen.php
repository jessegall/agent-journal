<?php

declare(strict_types=1);

namespace App\Agents\Values;

use Illuminate\Contracts\Support\Arrayable;

/**
 * A stable screen as the host sent it: its redacted rows, the highlighted row when a list is drawn, and the screen
 * generation a round must answer.
 *
 * @implements Arrayable<string, mixed>
 */
final readonly class NavigationScreen implements Arrayable
{
    /**
     * @param  list<string>  $rows
     */
    public function __construct(
        public array $rows,
        public int|null $highlight,
        public int $generation,
    ) {}

    public function toArray(): array
    {
        return ['rows' => $this->rows, 'highlight' => $this->highlight, 'generation' => $this->generation];
    }
}
