<?php

declare(strict_types=1);

namespace App\Core\Assignments\Contracts;

use App\Core\Assignments\Support\AssigneeRegistration;

/**
 * Where the application's composition registers which provider answers for each record type and actor kind. Only the
 * domain foundation and Core's own providers call it, while the application boots.
 */
interface AssignmentRegistration
{
    /**
     * @param  class-string<AssignableProvider>  $providerClass
     */
    public function registerRecord(string $type, string $providerClass): void;

    public function registerAssignees(AssigneeRegistration $registration): void;
}
