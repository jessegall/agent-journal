<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\HostWakeRefusal;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Values\NavigationRoundReport;
use App\Agents\Values\RequestReportBinding;
use App\Agents\Values\ScriptProgress;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Records how a host carried out a request in one attempt: its progress, actual binding and outcome, the allowlisted
 * reason it refused it for and whether it proved no process was made, and the claim's session, start and generation
 * the report answers. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportRequestProgress extends Command
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
    ) {}
}
