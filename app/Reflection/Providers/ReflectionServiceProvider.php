<?php

declare(strict_types=1);

namespace App\Reflection\Providers;

use App\Reflection\Contracts\ReflectorFactory;
use App\Reflection\Contracts\TypeReflections;
use App\Reflection\Support\CatalogueReflectorFactory;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the factory that hands classes their Reflectors from the process's one catalogue.
 */
final class ReflectionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ReflectorFactory::class, CatalogueReflectorFactory::class);
        $this->app->alias(ReflectorFactory::class, TypeReflections::class);
    }
}
