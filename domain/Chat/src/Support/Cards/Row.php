<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

use App\Web\Enums\Alignment;
use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Enums\PartType;

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
