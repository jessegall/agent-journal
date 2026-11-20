<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Agents\Models\MergeAttempt;
use App\Assignments\Contracts\MaintenanceAdmission;
use App\Contracts\CommandHandler;
use App\Supervision\Commands\SettleMergeOutcomes;
use App\Supervision\Support\MergeSettlement;

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

    public function handle(SettleMergeOutcomes $command): void
    {
        $this->access->assertMaintenanceGranted(SettleMergeOutcomes::MAINTENANCE_SCOPE);

        foreach (MergeAttempt::unacknowledged(self::PASS_LIMIT) as $attempt) {
            $this->settlement->settle(MergeAttempt::lockedById($attempt->id));
        }
    }
}
