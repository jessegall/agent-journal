<?php

declare(strict_types=1);

namespace App\Terminals\Data;

use App\Terminals\Enums\PaneNodeType;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * A node of a saved layout's pane grid, chosen by its type when the layout is read back.
 */
abstract class PaneNodeData extends Data implements PropertyMorphableData
{
    /**
     * A node of this type; the type picks the class the node is read back as.
     */
    public function __construct(
        #[PropertyForMorph]
        public readonly PaneNodeType $type,
    ) {}

    /**
     * @param  array{type: PaneNodeType}  $properties
     */
    public static function morph(array $properties): string
    {
        return $properties['type']->dataClass();
    }
}
