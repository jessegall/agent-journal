<?php

declare(strict_types=1);

namespace App\Processes\Commands\MarkRunsStale;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * Marks every unfinished run of a project stale after its active rules changed: an admission not yet started is
 * refused, a running run starts no further part.
 *
 * @extends Command<int>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class MarkRunsStaleCommand extends Command
{
    public function __construct(public string $projectId, public string $reason) {}
}
