<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

use App\Web\Enums\Emphasis;
use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Enums\PartType;

/**
 * A button that opens a page its owner declared; the page checks the viewer's access again as it opens.
 */
final readonly class Button implements DockPart
{
    public function __construct(
        public string $key,
        public string $label,
        public Emphasis $emphasis,
        public DockDestination $target,
    ) {
        PartKey::assertGiven($key, PartType::Button);
    }

    public function key(): string
    {
        return $this->key;
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
