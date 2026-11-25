<?php

declare(strict_types=1);

namespace App\Enums\Profiles;

use App\Values\BooleanOperand;
use App\Values\NamedCommand;
use App\Values\ScriptOperand;
use App\Values\TextOperand;

/**
 * What a script instruction acts on: a named command it runs, a condition it tests, or a text it says.
 */
enum ScriptOperandType: string
{
    case Command = 'command';
    case Condition = 'condition';
    case Text = 'text';

    /**
     * The Data class of an operand of this type.
     *
     * @return class-string<ScriptOperand>
     */
    public function dataClass(): string
    {
        return match ($this) {
            self::Command => NamedCommand::class,
            self::Condition => BooleanOperand::class,
            self::Text => TextOperand::class,
        };
    }
}
