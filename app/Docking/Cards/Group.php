<?php

declare(strict_types=1);

namespace App\Docking\Cards;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Enums\PartType;

/**
 * Parts shown together under a label.
 */
final readonly class Group implements DockPart
{
    /**
     * @var list<DockPart>
     */
    public array $children;

    public function __construct(public string $key, public string $label, DockPart ...$children)
    {
        PartKey::assertGiven($key, PartType::Group);

        $this->children = array_values($children);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::Group;
    }

    public function children(): array
    {
        return $this->children;
    }
}
