<?php

declare(strict_types=1);

namespace App\Concerns;

/**
 * Loads Core's route files from the project's routes folder, so each provider names only its file.
 */
trait LoadsCoreRoutes
{
    /**
     * One of Core's route files, named by its path under the routes folder, such as agents/host.php.
     */
    protected function loadCoreRoutes(string $file): void
    {
        $this->loadRoutesFrom($this->app->basePath("routes/{$file}"));
    }
}
