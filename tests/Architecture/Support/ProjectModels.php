<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Support\Reflector;
use Illuminate\Database\Eloquent\Model;

/**
 * Every concrete Eloquent model declared in a Models folder: of app and the domains, or under the roots given.
 */
final class ProjectModels
{
    /**
     * @return list<class-string<Model>>
     */
    public static function all(): array
    {
        return self::in([app_path(), ...DomainFiles::domainCode()]);
    }

    /**
     * @param  list<string>  $roots
     * @return list<class-string<Model>>
     */
    public static function in(array $roots): array
    {
        $models = [];

        foreach (self::filesIn($roots) as $file) {
            if (preg_match('/^namespace ([^;]+);/m', (string) file_get_contents($file), $namespace) !== 1) {
                continue;
            }

            $class = $namespace[1].'\\'.basename($file, '.php');

            if (Reflector::factory()->isSubclassOf($class, Model::class)
                && Reflector::of($class)->not()->isAbstract()) {
                $models[] = $class;
            }
        }

        return $models;
    }

    /**
     * The files of every Models folder of the app and the domains.
     *
     * @return list<string>
     */
    public static function files(): array
    {
        return self::filesIn([app_path(), ...DomainFiles::domainCode()]);
    }

    /**
     * @param  list<string>  $roots
     * @return list<string>
     */
    private static function filesIn(array $roots): array
    {
        return array_values(array_filter(DomainFiles::in($roots), fn (string $path) => str_contains($path, '/Models/')));
    }
}
