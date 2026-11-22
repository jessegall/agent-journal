<?php

declare(strict_types=1);

namespace App\Commands\PruneShareAudit;

use App\Contracts\Bus\CommandHandler;
use App\Enums\ShareAuditType;
use App\Models\Share;
use App\Models\ShareAudit;
use App\Support\ActorIdentity;
use App\Support\AuditPruning;
use Carbon\CarbonImmutable;

/**
 * Locks the shares of the rows past retention by id, adds each share's removed reads, denials and life steps to its
 * totals with the time of pruning, removes the rows and records one AuditPruned fact for the run. A run with nothing to
 * prune writes nothing.
 */
final readonly class PruneShareAuditHandler implements CommandHandler
{
    private const int MOST_PER_RUN = 100;

    public function handle(PruneShareAuditCommand $command): AuditPruning
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

        $this->removeAll(array_map(fn (ShareAudit $audit) => $audit->id, $batch));
        ShareAudit::create(null, ShareAuditType::AuditPruned, ActorIdentity::system(), (string) count($batch));

        return new AuditPruning(count($batch), count($due) > self::MOST_PER_RUN);
    }

    /**
     * Removes these rows for good.
     *
     * @param  list<string>  $ids
     */
    private function removeAll(array $ids): void
    {
        ShareAudit::query()->whereKey($ids)->delete();
    }
}
