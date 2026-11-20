<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

use App\Assignments\Contracts\AssignableProvider;

/**
 * A domain whose records can be assigned: each record type's link alias with the provider that answers for it.
 */
interface AssignableContributor
{
    /**
     * @return array<string, class-string<AssignableProvider>>
     */
    public function assignables(): array;
}
