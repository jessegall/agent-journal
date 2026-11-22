<?php

declare(strict_types=1);

namespace App\Processes\Commands\MarkRunsStale;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessPolicy;

/**
 * Marks every unfinished run of a project stale after its active rules changed: an admission not yet started is
 * refused, a running run starts no further part.
 *
 * @extends Command<int>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class MarkRunsStaleCommand extends Command
{
    public function __construct(public string $projectKey, public string $reason) {}
}
