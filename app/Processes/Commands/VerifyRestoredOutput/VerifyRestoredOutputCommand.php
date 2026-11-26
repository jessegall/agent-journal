<?php

declare(strict_types=1);

namespace App\Processes\Commands\VerifyRestoredOutput;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\RestoredCaptures;
use App\Support\Command;

/**
 * After an operator restored files to the output disk, a user checks a run's parts against their original chunk
 * checksums; only parts whose every byte matches become complete again.
 *
 * @extends Command<RestoredCaptures>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Test)]
final readonly class VerifyRestoredOutputCommand extends Command
{
    public function __construct(public string $runId) {}
}
