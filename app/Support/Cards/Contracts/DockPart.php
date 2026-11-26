<?php

declare(strict_types=1);

namespace App\Support\Cards\Contracts;

use App\Processes\Enums\PartType;

/**
 * One part of a dock card: a container that holds other parts in order, or a leaf. Its key is stable among its
 * siblings, so a fold or the focus survives a refresh.
 */
interface DockPart
{
    /**
     * The key the part is found under within its card.
     */
    public function key(): string;

    /**
     * The kind of part, which tells the frontend how to draw it.
     */
    public function type(): PartType;

    /**
     * @return list<DockPart>
     */
    public function children(): array;
}
