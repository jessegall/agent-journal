<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Sharing\Commands\PruneShareAudit;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Support\AuditPruning;
use Carbon\CarbonImmutable;

/**
 * Locks the shares of the rows past retention by id, adds each share's removed reads, denials and life steps to its
 * totals with the time of pruning, removes the rows and records one AuditPruned fact for the run. A run with nothing to
 * prune writes nothing.
 */
final readonly class PruneShareAuditHandler implements CommandHandler
{
    private const int MOST_PER_RUN = 100;

    public function handle(PruneShareAudit $command): AuditPruning
    {
        $now = CarbonImmutable::now();
        $due = ShareAudit::lockPastRetention($now, self::MOST_PER_RUN + 1);
        $batch = array_slice($due, 0, self::MOST_PER_RUN);

        if ($batch === []) {
            return new AuditPruning(0, false);
        }

        $rowsOfShare = [];

        foreach ($batch as $audit) {
            $rowsOfShare[(string) $audit->share_id][] = $audit->type;
        }

        ksort($rowsOfShare);

        foreach ($rowsOfShare as $shareId => $types) {
            $allowed = count(array_filter($types, fn (ShareAuditType $type) => $type === ShareAuditType::ReadAllowed));
            $denied = count(array_filter($types, fn (ShareAuditType $type) => $type === ShareAuditType::ReadDenied));
            Share::lockForChange($shareId)->countPruned($allowed, $denied, count($types) - $allowed - $denied, $now);
        }

        ShareAudit::removeAll(array_map(fn (ShareAudit $audit) => $audit->id, $batch));
        ShareAudit::recordForInstallation(ShareAuditType::AuditPruned, ActorIdentity::system(), (string) count($batch));

        return new AuditPruning(count($batch), count($due) > self::MOST_PER_RUN);
    }
}
