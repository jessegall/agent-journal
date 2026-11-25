<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Profiles\ScriptOperandType;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * What a compiled script instruction acts on, chosen by its type when a stored script is read back.
 */
abstract class ScriptOperand extends Data implements PropertyMorphableData
{
    #[PropertyForMorph]
    public ScriptOperandType $type;

    /**
     * @param  array<string, mixed>  $properties
     */
    public static function morph(array $properties): string
    {
        return ScriptOperandType::from($properties['type'])->dataClass();
    }

    /**
     * How the operand reads in a flowchart.
     */
    abstract public function label(): string;
}
