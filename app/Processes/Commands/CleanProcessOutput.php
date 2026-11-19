<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\CleanProcessOutputHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\CleanPreview;

/**
 * A user removes the stored output of ended runs, after seeing a preview of what goes; their parts say the output
 * was removed and their receipts stay.
 *
 * @extends Command<CleanPreview>
 */
#[HandledBy(CleanProcessOutputHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
final readonly class CleanProcessOutput extends Command implements HasAuthorizationSubject
{
    /**
     * @param  list<string>  $runIds
     */
    public function __construct(public array $runIds, public bool $preview) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
