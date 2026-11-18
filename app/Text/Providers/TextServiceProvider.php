<?php

declare(strict_types=1);

namespace App\Text\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Core's text: reading any record's versioned text, with its routes for signed agents and signed-in users.
 */
final class TextServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/text.php');
    }
}
