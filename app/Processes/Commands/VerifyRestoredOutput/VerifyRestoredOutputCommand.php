<?php

declare(strict_types=1);

namespace App\Processes\Commands\VerifyRestoredOutput;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * After an operator restored files to the output disk, a user checks a run's parts against their original chunk
 * checksums; only parts whose every byte matches become complete again.
 *
 * @extends Command<array<string, string>>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Test)]
final readonly class VerifyRestoredOutputCommand extends Command
{
    public function __construct(public string $runId) {}
}
