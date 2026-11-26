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

        foreach (DomainFiles::in($roots) as $file) {
            if (! str_contains($file, '/Models/')
                || preg_match('/^namespace ([^;]+);/m', (string) file_get_contents($file), $namespace) !== 1) {
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
}
