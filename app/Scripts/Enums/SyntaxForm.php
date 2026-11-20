<?php

declare(strict_types=1);

namespace App\Scripts\Enums;

enum SyntaxForm: string
{
    case Handler = 'handler';
    case ElseBlock = 'else_block';
    case EndBlock = 'end_block';
    case Trigger = 'trigger';
    case Negation = 'negation';
    case CommandKey = 'command_key';
    case Expression = 'expression';
    case Text = 'text';
    case Block = 'block';

    public function isStatement(): bool
    {
        return match ($this) {
            self::CommandKey, self::Expression, self::Text, self::Block => true,
            default => false,
        };
    }
}
