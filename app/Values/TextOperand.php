<?php

declare(strict_types=1);

namespace App\Values;

use App\Profiles\Enums\ScriptOperandType;

/**
 * A text an instruction says.
 */
final class TextOperand extends ScriptOperand
{
    public function __construct(public readonly string $text)
    {
        $this->type = ScriptOperandType::Text;
    }

    public function label(): string
    {
        return '"'.$this->text.'"';
    }
}
