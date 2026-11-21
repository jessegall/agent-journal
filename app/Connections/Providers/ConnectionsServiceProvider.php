<?php

declare(strict_types=1);

namespace App\Connections\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Connects projects on other machines to this journal: the install line's URL and the script it serves.
 */
final class ConnectionsServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/connections.php');
    }
}
