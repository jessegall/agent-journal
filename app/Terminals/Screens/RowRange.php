<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

use App\Hosts\Data\HostFrameData;
use App\Values\RowGuard;

/**
 * The rows a region takes on the screen, from the first up to the last, which it does not include.
 */
final readonly class RowRange
{
    public function __construct(public int $first, public int $last) {}

    /**
     * Whether the row lies in the range.
     */
    public function holds(int $row): bool
    {
        return $row >= $this->first && $row < $this->last;
    }

    /**
     * The guard a key read on these rows carries: the host refuses it once the rows drawn there changed.
     */
    public function guardOn(HostFrameData $frame): RowGuard
    {
        $rows = array_slice($frame->rows, $this->first, $this->last - $this->first);

        return new RowGuard($this->first, $this->last - 1, hash('sha256', implode("\n", $rows)));
    }

    /**
     * @return list<int>
     */
    public function rows(): array
    {
        return range($this->first, $this->last - 1);
    }
}
