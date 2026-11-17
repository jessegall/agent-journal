<?php

declare(strict_types=1);

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Application;
use Tests\Support\HookDatabase;

/**
 * The application Laravel's parallel runner boots for each process before any worker runs; it checks the base hook
 * database first, so a wrong or missing base database is refused before Laravel creates a worker database.
 */
trait CreatesApplication
{
    public function createApplication(): Application
    {
        $app = require Application::inferBasePath().'/bootstrap/app.php';
        $app->make(Kernel::class)->bootstrap();

        HookDatabase::checkBase($app);

        return $app;
    }
}
