<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\StartSampleHandler;

/**
 * The permitted actor starts the approved sample of a request once; the same request key returns the same run.
 *
 * @implements Command<string>
 */
#[HandledBy(StartSampleHandler::class)]
final readonly class StartSample implements Command
{
    public function __construct(public string $commandRequestId, public string $permitId, public string $requestKey) {}
}
