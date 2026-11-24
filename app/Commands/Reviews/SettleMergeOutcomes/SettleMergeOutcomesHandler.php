<?php

declare(strict_types=1);

namespace App\Commands\Reviews\SettleMergeOutcomes;

use App\Contracts\Admission\MaintenanceAdmission;
use App\Contracts\Bus\CommandHandler;
use App\Models\Reviews\MergeAttempt;
use App\Support\MergeSettlement;

/**
 * Settles a bounded batch of unsettled merge attempts under the engine's supervision.merges grant.
 */
final readonly class SettleMergeOutcomesHandler implements CommandHandler
{
    /**
     * The most attempts one pass settles.
     */
    private const int PASS_LIMIT = 5;

    public function __construct(private MaintenanceAdmission $access, private MergeSettlement $settlement) {}

    public function handle(SettleMergeOutcomesCommand $command): void
    {
        $this->access->assertMaintenanceGranted(SettleMergeOutcomesCommand::MAINTENANCE_SCOPE);

        foreach (MergeAttempt::unacknowledged(self::PASS_LIMIT) as $attempt) {
            $this->settlement->settle(MergeAttempt::lockedById($attempt->id));
        }
    }
}
