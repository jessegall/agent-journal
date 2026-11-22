<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Support\Domain;
use App\Support\Reflector;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Seeder;
use Illuminate\Support\ServiceProvider;

/**
 * A file outside every domain that puts the application together, and the one type of domain or Core class it may name.
 */
enum CompositionSite: string
{
    case Domains = 'bootstrap/domains.php';
    case Providers = 'bootstrap/providers.php';
    case Application = 'bootstrap/app.php';
    case Authentication = 'config/auth.php';
    case Seeders = 'database/seeders/DatabaseSeeder.php';

    public static function holding(string $file, string $basePath): self|null
    {
        return self::tryFrom(ltrim(substr($file, strlen($basePath)), '/'));
    }

    /**
     * Whether this file may name the class: a descriptor, a provider, a middleware, the user model or a seeder.
     */
    public function mayName(string $className): bool
    {
        return match ($this) {
            self::Domains => Reflector::factory()->isSubclassOf($className, Domain::class),
            self::Providers => Reflector::factory()->isSubclassOf($className, ServiceProvider::class),
            self::Application => str_contains($className, '\\Http\\Middleware\\')
                && Reflector::exists($className)
                && Reflector::of($className)->isClass(),
            self::Authentication => Reflector::factory()->isSubclassOf($className, Authenticatable::class),
            self::Seeders => Reflector::factory()->isSubclassOf($className, Seeder::class),
        };
    }

    /**
     * @return list<string>
     */
    public static function files(string $basePath): array
    {
        return array_map(fn (self $site) => "{$basePath}/{$site->value}", self::cases());
    }
}
