<?php

declare(strict_types=1);

namespace App\Projects\Commands\ProvisionLocalProject;

use App\Access\EnvironmentAccess;
use App\Bus\Contracts\CommandHandler;
use App\Messages\Enums\InboxPermission;
use App\Models\Projects\Environment;
use App\Models\Projects\Project;

/**
 * Creates the local project with its Main environment and grants the owner every permission on that environment's real
 * id; running it again for the same key changes nothing.
 */
final readonly class ProvisionLocalProjectHandler implements CommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(ProvisionLocalProjectCommand $command): void
    {
        if (Project::query()->withKey($command->key)->exists()) {
            return;
        }

        $project = Project::create($command->key, $command->label);
        $environment = Environment::createForDefault($project);
        $this->access->grant($command->ownerId, $environment->id, InboxPermission::cases());
    }
}
