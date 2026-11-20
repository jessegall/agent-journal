<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

interface MaintenanceAdmission
{
    public function assertMaintenanceGranted(string $capability): void;
}
