<?php

declare(strict_types=1);

namespace Domain\Tasks\Enums;

/**
 * How much of one task a read gives: its summary, or its context with the brief, the result note and the reasons.
 */
enum TaskView: string
{
    case Summary = 'summary';
    case Context = 'context';

    public function includesText(): bool
    {
        return $this === self::Context;
    }
}
