<?php

declare(strict_types=1);

namespace App\Commands\Runs\MarkRunsStale;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
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
