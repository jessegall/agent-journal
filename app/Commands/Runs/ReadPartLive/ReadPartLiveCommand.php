<?php

declare(strict_types=1);

namespace App\Commands\Runs\ReadPartLive;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * Reads a part's newly committed output with its approved reader from the reader's last position; the result is
 * provisional and never a final assessment.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Read)]
final readonly class ReadPartLiveCommand extends Command
{
    public function __construct(public string $partRunId) {}
}
