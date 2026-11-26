<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

/**
 * A domain whose records are internal responsibilities, such as task runs: only Core's own writers assign them.
 */
interface InternalAssignableContributor
{
    /**
     * @return array<string, class-string<AssignableProvider>>
     */
    public function internalAssignables(): array;
}
