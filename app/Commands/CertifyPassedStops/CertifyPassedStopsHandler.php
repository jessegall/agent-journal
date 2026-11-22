<?php

declare(strict_types=1);

namespace App\Commands\CertifyPassedStops;

use App\Contracts\Admission\MaintenanceAdmission;
use App\Contracts\Bus\CommandHandler;
use App\Models\StopAttempt;
use App\Support\StopCertification;

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

    public function handle(CertifyPassedStopsCommand $command): void
    {
        $this->access->assertMaintenanceGranted(CertifyPassedStopsCommand::MAINTENANCE_SCOPE);

        foreach (StopAttempt::passedUncertified(self::PASS_LIMIT) as $attempt) {
            $this->certification->certify($attempt);
        }
    }
}
