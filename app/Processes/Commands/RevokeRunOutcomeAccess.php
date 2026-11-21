<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessPolicy;

/**
 * The run's owner takes back the outcome entitlement its request gave a user: the user's receipt leaves their list
 * and count, and their open views drop what they show.
 *
 * @extends Command<null>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class RevokeRunOutcomeAccess extends Command
{
    public function __construct(public string $runId) {}
}
