<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What an operand or an option value of a declared command stands for.
 */
enum OperandType: string
{
    case Path = 'path';
    case Branch = 'branch';
    case Remote = 'remote';
    case Revision = 'revision';
    case Url = 'url';
    case Text = 'text';
    case Pattern = 'pattern';
    case Count = 'count';
    case Name = 'name';
}
