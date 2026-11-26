<?php

declare(strict_types=1);

namespace App\Terminals\Data;

use App\Terminals\Enums\PaneNodeType;

/**
 * A pane of the grid: its windows as tabs, the one shown, and whether it keeps to the reading width.
 */
final class PaneData extends PaneNodeData
{
    /**
     * @param  list<string>  $windows
     */
    public function __construct(
        public readonly string $id,
        public readonly array $windows,
        public readonly string|null $active,
        public readonly bool $isWidthLimited,
    ) {
        parent::__construct(PaneNodeType::Pane);
    }
}
