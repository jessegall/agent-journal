<?php

declare(strict_types=1);

namespace Domain\Plans\Enums;

/**
 * How much of one plan a read gives: its summary, or its context with the brief and the notes.
 */
enum PlanView: string
{
    case Summary = 'summary';
    case Context = 'context';

    public function includesText(): bool
    {
        return $this === self::Context;
    }
}
