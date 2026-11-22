<?php

declare(strict_types=1);

namespace App\Support\Cards;

use App\Enums\Emphasis;
use App\Enums\PartType;
use App\Support\Cards\Contracts\DockPart;

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
