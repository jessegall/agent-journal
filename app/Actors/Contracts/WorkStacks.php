<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

/**
 * The session stacks the operation of whoever acts in this request must be admitted to, from its type's provider.
 */
interface WorkStacks
{
    /**
     * @return list<string> session ids, sorted, so every operation admits them in one order
     */
    public function sessionsToAdmit(): array;
}
