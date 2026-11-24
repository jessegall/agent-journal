<?php

declare(strict_types=1);

namespace App\Commands\Projects\AssignBindingEnvironment;

use App\Contracts\Bus\CommandHandler;
use App\Models\Projects\Environment;
use App\Models\Projects\ProjectBinding;

/**
 * Assigns the binding, held locked, the environment of its own project the owner chose.
 */
final readonly class AssignBindingEnvironmentHandler implements CommandHandler
{
    public function handle(AssignBindingEnvironmentCommand $command): void
    {
        $binding = ProjectBinding::lockById($command->bindingId);
        $binding->assignEnvironment(Environment::ofProjectById($binding->project_id, $command->environmentId));
    }
}
