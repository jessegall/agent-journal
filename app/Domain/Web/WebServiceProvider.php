<?php

declare(strict_types=1);

namespace App\Domain\Web;

use Illuminate\Support\ServiceProvider;

/**
 * Registers the browser routes; the only place that does.
 */
final class WebServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/Routes/web.php');
    }
}
