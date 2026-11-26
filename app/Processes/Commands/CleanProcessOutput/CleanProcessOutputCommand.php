<?php

declare(strict_types=1);

namespace App\Processes\Commands\CleanProcessOutput;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\CleanPreview;
use App\Support\Command;

/**
 * A user removes the stored output of ended runs, after seeing a preview of what goes; their parts say the output
 * was removed and their receipts stay.
 *
 * @extends Command<CleanPreview>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class CleanProcessOutputCommand extends Command
{
    /**
     * @param  list<string>  $runIds
     */
    public function __construct(public array $runIds, public bool $isPreview) {}
}
