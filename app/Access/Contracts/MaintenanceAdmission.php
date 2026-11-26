<?php

declare(strict_types=1);

namespace App\Access\Contracts;

interface MaintenanceAdmission
{
    /**
     * Refuses unless the current actor holds the maintenance capability.
     */
    public function assertMaintenanceGranted(string $capability): void;
}
