<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Handlers\ReportRequestProgressHandler;
use App\Agents\Values\NavigationRoundReport;
use App\Agents\Values\ScriptProgress;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Records how a host carried out a request in one attempt: its progress, actual binding and outcome. Run for an
 * authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[HandledBy(ReportRequestProgressHandler::class)]
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
    ) {}
}
