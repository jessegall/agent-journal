<?php

declare(strict_types=1);

namespace App\Commands\Runs\StopProcessRun;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * A user, or the actor who runs it, stops a run: no further part starts, and what was captured stays readable.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class StopProcessRunCommand extends Command
{
    public function __construct(public string $runId, public string $reason) {}
}
