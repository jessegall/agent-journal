<?php

declare(strict_types=1);

namespace Domain\Helpers\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * The service provider of the Helpers domain; its later tasks bind its readers and routes here.
 */
final class HelpersServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void {}
}
