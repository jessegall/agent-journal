<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\ReadPartLiveHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * Reads a part's newly committed output with its approved reader from the reader's last position; the result is
 * provisional and never a final assessment.
 *
 * @extends Command<string>
 */
#[HandledBy(ReadPartLiveHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class ReadPartLive extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $partRunId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
