<?php

declare(strict_types=1);

namespace App\Enums\CommandRules;

/**
 * How a tool's output bytes are encoded.
 */
enum OutputEncoding: string
{
    case Utf8 = 'utf8';
    case Binary = 'binary';
}
