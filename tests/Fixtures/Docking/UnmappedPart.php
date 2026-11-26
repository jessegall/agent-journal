<?php

declare(strict_types=1);

namespace Tests\Fixtures\Docking;

use App\Processes\Enums\PartType;
use App\Support\Cards\Contracts\DockPart;

/**
 * A part the part map does not know, standing for a card whose tree cannot be written.
 */
final readonly class UnmappedPart implements DockPart
{
    public function key(): string
    {
        return 'unmapped';
    }

    public function type(): PartType
    {
        return PartType::Button;
    }

    public function children(): array
    {
        return [];
    }
}
