<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\IssueEvidencePermit;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;

/**
 * A project owner lets one actor run one exact, fully known command line once, as an evidence-only sample.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Create)]
final readonly class IssueEvidencePermitCommand extends Command
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
