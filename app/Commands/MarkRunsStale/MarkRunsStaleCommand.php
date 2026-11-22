<?php

declare(strict_types=1);

namespace App\Commands\MarkRunsStale;

use App\Attributes\Authorize;
use App\Enums\AccessType;
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
    public function __construct(public string $projectKey, public string $reason) {}
}
