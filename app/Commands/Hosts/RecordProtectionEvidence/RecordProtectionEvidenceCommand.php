<?php

declare(strict_types=1);

namespace App\Commands\Hosts\RecordProtectionEvidence;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Drivers\BoundaryItem;
use App\Enums\Drivers\IsolationPlatform;
use App\Support\Command;

/**
 * Records the operator's run that showed the items hold for a driver family's pinned build on a platform of a host,
 * then judges that protection again (internal, not exported; the operator runs accounts:record-protection-run).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordProtectionEvidenceCommand extends Command
{
    /**
     * @param  list<BoundaryItem>  $items
     */
    public function __construct(
        public string $hostId,
        public string $family,
        public IsolationPlatform $platform,
        public array $items,
        public string $run,
    ) {}
}
