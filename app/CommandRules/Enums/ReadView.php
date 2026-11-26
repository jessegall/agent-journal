<?php

declare(strict_types=1);

namespace App\CommandRules\Enums;

/**
 * How much of one record a read gives: its summary, or its context with its long texts.
 */
enum ReadView: string
{
    case Summary = 'summary';
    case Context = 'context';

    public function includesText(): bool
    {
        return $this === self::Context;
    }
}
