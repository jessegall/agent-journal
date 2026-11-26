<?php

declare(strict_types=1);

namespace App\Values;

use App\Profiles\Enums\ScriptOperandType;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * What a compiled script instruction acts on, chosen by its type when a stored script is read back.
 */
abstract class ScriptOperand extends Data implements PropertyMorphableData
{
    /**
     * The property the data is morphed by, as the library hands it to morph() before any data exists.
     */
    private const string MORPHED_BY = 'type';

    #[PropertyForMorph]
    public ScriptOperandType $type;

    /**
     * @param  array{type: ScriptOperandType}  $properties
     */
    public static function morph(array $properties): string
    {
        return $properties[self::MORPHED_BY]->dataClass();
    }

    /**
     * How the operand reads in a flowchart.
     */
    abstract public function label(): string;
}
