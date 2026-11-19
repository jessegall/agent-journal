<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\IssueEvidencePermitHandler;

/**
 * A project owner lets one actor run one exact, fully known command line once, as an evidence-only sample.
 *
 * @implements Command<string>
 */
#[HandledBy(IssueEvidencePermitHandler::class)]
final readonly class IssueEvidencePermit implements Command
{
    public function __construct(
        public string $line,
        public string $workingFolder,
        public string $runnerType,
        public string $runnerId,
        public int $byteCap = 104_857_600,
        public int $secondsCap = 600,
        public int $minutesValid = 60,
    ) {}
}
