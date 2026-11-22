<?php

declare(strict_types=1);

namespace App\Support\Cards\Contracts;

use App\Enums\PartType;

/**
 * One part of a dock card: a container that holds other parts in order, or a leaf. Its key is stable among its
 * siblings, so a fold or the focus survives a refresh.
 */
interface DockPart
{
    public function key(): string;

    public function type(): PartType;

    /**
     * @return list<DockPart>
     */
    public function children(): array;
}
