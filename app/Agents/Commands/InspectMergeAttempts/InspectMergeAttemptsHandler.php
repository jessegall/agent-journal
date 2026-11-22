<?php

declare(strict_types=1);

namespace App\Agents\Commands\InspectMergeAttempts;

use App\Agents\Events\MergeOutcomeRecorded;
use App\Agents\Models\MergeAttempt;
use App\Agents\Support\ProtectedMerge;
use App\Assignments\Contracts\MaintenanceAdmission;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use Illuminate\Support\Carbon;

/**
 * Inspects merge attempts no run has touched for a while, under the engine's agents.merges grant.
 */
final readonly class InspectMergeAttemptsHandler implements CommandHandler
{
    /**
     * How long an attempt may stand unfinished before the engine inspects it.
     */
    private const int STALE_MINUTES = 10;

    /**
     * The most attempts one pass inspects.
     */
    private const int PASS_LIMIT = 5;

    public function __construct(
        private MaintenanceAdmission $access,
        private ProtectedMerge $merge,
        private CommandFacts $facts,
    ) {}

    public function handle(InspectMergeAttemptsCommand $command): void
    {
        $this->access->assertMaintenanceGranted(InspectMergeAttemptsCommand::MAINTENANCE_SCOPE);
        $stale = Carbon::now()->subMinutes(self::STALE_MINUTES);

        foreach (MergeAttempt::interrupted($stale, self::PASS_LIMIT) as $attempt) {
            $this->merge->inspect(MergeAttempt::lockedById($attempt->id));
            $this->facts->publishAfterCommit(new MergeOutcomeRecorded($attempt->id));
            $this->facts->applyRequired();
        }
    }
}
