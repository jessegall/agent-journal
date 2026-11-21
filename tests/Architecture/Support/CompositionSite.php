<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Domains\Support\Domain;
use App\Reflection\Support\Reflector;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Seeder;
use Illuminate\Support\ServiceProvider;
use PhpOption\Option;

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
        $type = Reflector::find($className);

        return match ($this) {
            self::Domains => self::isSubclass($type, Domain::class),
            self::Providers => self::isSubclass($type, ServiceProvider::class),
            self::Application => str_contains($className, '\\Http\\Middleware\\')
                && $type->filter(fn (Reflector $found) => $found->isClass())->isDefined(),
            self::Authentication => self::isSubclass($type, Authenticatable::class),
            self::Seeders => self::isSubclass($type, Seeder::class),
        };
    }

    /**
     * @param  Option<Reflector<object>>  $type
     * @param  class-string  $parent
     */
    private static function isSubclass(Option $type, string $parent): bool
    {
        return $type->filter(fn (Reflector $found) => $found->isSubclassOf($parent))->isDefined();
    }

    /**
     * @return list<string>
     */
    public static function files(string $basePath): array
    {
        return array_map(fn (self $site) => "{$basePath}/{$site->value}", self::cases());
    }
}
