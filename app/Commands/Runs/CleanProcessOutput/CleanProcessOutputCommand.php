<?php

declare(strict_types=1);

namespace App\Commands\Runs\CleanProcessOutput;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;
use App\Values\CleanPreview;

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
