<?php

declare(strict_types=1);

namespace App\Commands\VerifyRestoredOutput;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;

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
