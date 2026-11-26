<?php

declare(strict_types=1);

namespace App\Sessions\Commands\HoldProfileRevision;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentPolicy;
use App\Support\Command;

/**
 * Retains the intent to fence every session started from a revoked profile revision, in the transaction that revokes
 * it, so a lost event cannot lose the revocation.
 *
 * @extends Command<string>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class HoldProfileRevisionCommand extends Command
{
    public function __construct(
        public string $key,
        public int $revision,
    ) {}
}
