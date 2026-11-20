<?php

declare(strict_types=1);

namespace App\Hooks\Handlers;

use App\Assignments\Contracts\MaintenanceAdmission;
use App\Contracts\CommandHandler;
use App\Hooks\Commands\CertifyPassedStops;
use App\Hooks\Models\StopAttempt;
use App\Hooks\Support\StopCertification;

/**
 * Certifies a bounded batch of passed, uncertified stops under the engine's hooks.certify grant.
 */
final readonly class CertifyPassedStopsHandler implements CommandHandler
{
    /**
     * The most stops one pass certifies.
     */
    private const int PASS_LIMIT = 20;

    public function __construct(private MaintenanceAdmission $access, private StopCertification $certification) {}

    public function handle(CertifyPassedStops $command): void
    {
        $this->access->assertMaintenanceGranted(CertifyPassedStops::MAINTENANCE_SCOPE);

        foreach (StopAttempt::passedUncertified(self::PASS_LIMIT) as $attempt) {
            $this->certification->certify($attempt);
        }
    }
}
