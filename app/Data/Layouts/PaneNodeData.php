<?php

declare(strict_types=1);

namespace App\Data\Layouts;

use App\Enums\Layouts\PaneNodeType;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * A node of a saved layout's pane grid, chosen by its type when the layout is read back.
 */
abstract class PaneNodeData extends Data implements PropertyMorphableData
{
    #[PropertyForMorph]
    public readonly PaneNodeType $type;

    /**
     * @param  array{type: PaneNodeType}  $properties
     */
    public static function morph(array $properties): string
    {
        return $properties['type']->dataClass();
    }
}
