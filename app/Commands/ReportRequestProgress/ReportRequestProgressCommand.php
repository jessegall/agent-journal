<?php

declare(strict_types=1);

namespace App\Commands\ReportRequestProgress;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Enums\HostWakeRefusal;
use App\Enums\RequestOutcome;
use App\Enums\RequestProgress;
use App\Support\Command;
use App\Values\NavigationRoundReport;
use App\Values\RequestReportBinding;
use App\Values\ScriptProgress;

/**
 * Records how a host carried out a request in one attempt: its progress, actual binding and outcome, the allowlisted
 * reason it refused it for and whether it proved no process was made, and the claim's session, start and generation
 * the report answers. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportRequestProgressCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $requestId,
        public int $attempt,
        public RequestProgress $progress,
        public string|null $actualBinding,
        public RequestOutcome|null $outcome,
        public ScriptProgress|null $script = null,
        public NavigationRoundReport|null $navigation = null,
        public HostWakeRefusal|null $refusal = null,
        public bool $noProcessCreated = false,
        public RequestReportBinding|null $binding = null,
        /** the report's place in its runtime generation's numbered reports; none from a host that numbers none */
        public int|null $sequence = null,
    ) {}
}
