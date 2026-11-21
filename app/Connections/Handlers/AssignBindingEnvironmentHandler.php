<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\AssignBindingEnvironment;
use App\Connections\Models\Environment;
use App\Connections\Models\ProjectBinding;
use App\Contracts\CommandHandler;

/**
 * Assigns the binding, held locked, the environment of its own project the owner chose.
 */
final readonly class AssignBindingEnvironmentHandler implements CommandHandler
{
    public function handle(AssignBindingEnvironment $command): void
    {
        $binding = ProjectBinding::lockById($command->bindingId);
        $binding->assignEnvironment(Environment::ofProjectById($binding->project_id, $command->environmentId));
    }
}
