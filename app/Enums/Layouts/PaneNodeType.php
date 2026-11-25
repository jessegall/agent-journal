<?php

declare(strict_types=1);

namespace App\Enums\Layouts;

use App\Data\Layouts\PaneData;
use App\Data\Layouts\PaneNodeData;
use App\Data\Layouts\SplitData;

/**
 * What a node of a saved layout's pane grid is: a pane of windows, or a split into two nodes.
 */
enum PaneNodeType: string
{
    case Pane = 'pane';
    case Split = 'split';

    /**
     * The Data class of a node of this type.
     *
     * @return class-string<PaneNodeData>
     */
    public function dataClass(): string
    {
        return match ($this) {
            self::Pane => PaneData::class,
            self::Split => SplitData::class,
        };
    }
}
