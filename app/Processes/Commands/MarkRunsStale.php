<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\MarkRunsStaleHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * Marks every unfinished run of a project stale after its active rules changed: an admission not yet started is
 * refused, a running run starts no further part.
 *
 * @extends Command<int>
 */
#[HandledBy(MarkRunsStaleHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class MarkRunsStale extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $projectKey, public string $reason) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
