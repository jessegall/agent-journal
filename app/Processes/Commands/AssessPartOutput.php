<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\AssessPartOutputHandler;

/**
 * Interprets an ended part's output with the approved reader of its operation, validates it and publishes its result
 * receipt or says why there is none. The answer is the receipt id, or empty when there is no result.
 *
 * @implements Command<string>
 */
#[HandledBy(AssessPartOutputHandler::class)]
final readonly class AssessPartOutput implements Command
{
    public function __construct(public string $partRunId) {}
}
