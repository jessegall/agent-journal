<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\StartSample;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
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
