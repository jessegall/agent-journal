<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessPolicy;

/**
 * A user, or the actor who runs it, stops a run: no further part starts, and what was captured stays readable.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class StopProcessRun extends Command
{
    public function __construct(public string $runId, public string $reason) {}
}
