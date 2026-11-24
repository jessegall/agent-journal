<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * What an event is for, which decides who may send it.
 */
enum EventRole
{
    case RowFact;
    case CommandFact;
    case Request;
    case Projection;
    case Infrastructure;

    /**
     * Whether it is a transition of one row, which only its owning model method raises once migrated.
     */
    public function isRowFact(): bool
    {
        return $this === self::RowFact;
    }
}
