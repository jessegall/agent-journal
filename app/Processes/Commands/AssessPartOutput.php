<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessPolicy;

/**
 * Interprets an ended part's output with the approved reader of its operation, validates it and publishes its result
 * receipt or says why there is none. The answer is the receipt id, or empty when there is no result.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class AssessPartOutput extends Command
{
    public function __construct(public string $partRunId) {}
}
