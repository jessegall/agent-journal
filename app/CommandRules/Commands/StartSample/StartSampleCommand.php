<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\StartSample;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * The permitted actor starts the approved sample of a request once; the same request key returns the same run.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Test)]
final readonly class StartSampleCommand extends Command
{
    public function __construct(public string $commandRequestId, public string $permitId, public string $requestKey) {}
}
