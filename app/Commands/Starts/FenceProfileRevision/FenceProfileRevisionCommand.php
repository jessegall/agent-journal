<?php

declare(strict_types=1);

namespace App\Commands\Starts\FenceProfileRevision;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;

/**
 * Retains the intent to fence every session started from a revoked profile revision, in the transaction that revokes
 * it, so a lost event cannot lose the revocation.
 *
 * @extends Command<string>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class FenceProfileRevisionCommand extends Command
{
    public function __construct(
        public string $key,
        public int $revision,
    ) {}
}
