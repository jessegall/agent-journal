<?php

declare(strict_types=1);

namespace App\Docking\Cards;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Enums\Alignment;
use App\Docking\Enums\PartType;

/**
 * Parts shown side by side, wrapping on a narrow card, placed by the alignment.
 */
final readonly class Row implements DockPart
{
    /**
     * @var list<DockPart>
     */
    public array $children;

    public function __construct(public string $key, public Alignment $alignment, DockPart ...$children)
    {
        PartKey::assertGiven($key, PartType::Row);

        $this->children = array_values($children);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::Row;
    }

    public function children(): array
    {
        return $this->children;
    }
}
