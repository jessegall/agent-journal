<?php

declare(strict_types=1);

namespace App\Connections\Commands\AssignBindingEnvironment;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Connections\Policies\ConnectionsPolicy;
use App\Operations\Enums\AccessType;

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
