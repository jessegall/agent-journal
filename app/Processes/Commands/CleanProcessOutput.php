<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\CleanPreview;

/**
 * A user removes the stored output of ended runs, after seeing a preview of what goes; their parts say the output
 * was removed and their receipts stay.
 *
 * @extends Command<CleanPreview>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class CleanProcessOutput extends Command
{
    /**
     * @param  list<string>  $runIds
     */
    public function __construct(public array $runIds, public bool $preview) {}
}
