<?php

declare(strict_types=1);

namespace App\Processes\Commands\ApproveSample;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A project owner approves one evidence sample of a request's exact line under its proposed declaration; the answer
 * is the one-use permit the request's actor runs it with.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class ApproveSampleCommand extends Command
{
    public function __construct(
        public string $commandRequestId,
        public int $expectedRevision,
        public string $commandDigest,
    ) {}
}
