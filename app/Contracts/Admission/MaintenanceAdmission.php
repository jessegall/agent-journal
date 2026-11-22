<?php

declare(strict_types=1);

namespace App\Contracts\Admission;

interface MaintenanceAdmission
{
    public function assertMaintenanceGranted(string $capability): void;
}
