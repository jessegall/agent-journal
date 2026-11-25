<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\ApproveSample;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;

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
