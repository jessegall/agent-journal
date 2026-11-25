<?php

declare(strict_types=1);

namespace App\Commands\Projects\AssignBindingEnvironment;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ConnectionsPolicy;
use App\Support\Command;

/**
 * The owner puts a binding with no environment into an existing environment of its project, chosen by id, never
 * inferred from a name.
 *
 * @extends Command<null>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Edit)]
final readonly class AssignBindingEnvironmentCommand extends Command
{
    public function __construct(public string $bindingId, public string $environmentId) {}
}
