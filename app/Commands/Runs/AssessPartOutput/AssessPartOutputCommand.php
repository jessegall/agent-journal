<?php

declare(strict_types=1);

namespace App\Commands\Runs\AssessPartOutput;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * Interprets an ended part's output with the approved reader of its operation, validates it and publishes its result
 * receipt or says why there is none. The answer is the receipt id, or empty when there is no result.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class AssessPartOutputCommand extends Command
{
    public function __construct(public string $partRunId) {}
}
