<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessPolicy;

/**
 * The permitted actor starts the approved sample of a request once; the same request key returns the same run.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Test)]
final readonly class StartSample extends Command
{
    public function __construct(public string $commandRequestId, public string $permitId, public string $requestKey) {}
}
