<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RecordProtectionEvidence;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Enums\BoundaryItem;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Attributes\Commands\Entry;
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
