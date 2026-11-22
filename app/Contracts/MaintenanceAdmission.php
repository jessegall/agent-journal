<?php

declare(strict_types=1);

namespace App\Contracts;

interface MaintenanceAdmission
{
    public function assertMaintenanceGranted(string $capability): void;
}
