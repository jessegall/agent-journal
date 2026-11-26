<?php

declare(strict_types=1);

namespace App\Processes\Commands\RevokeRunOutcomeAccess;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * The run's owner takes back the outcome entitlement its request gave a user: the user's receipt leaves their list
 * and count, and their open views drop what they show.
 *
 * @extends Command<null>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class RevokeRunOutcomeAccessCommand extends Command
{
    public function __construct(public string $runId) {}
}
