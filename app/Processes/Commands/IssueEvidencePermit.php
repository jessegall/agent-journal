<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\IssueEvidencePermitHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A project owner lets one actor run one exact, fully known command line once, as an evidence-only sample.
 *
 * @extends Command<string>
 */
#[HandledBy(IssueEvidencePermitHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
final readonly class IssueEvidencePermit extends Command implements HasAuthorizationSubject
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

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
