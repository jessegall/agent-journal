<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Every model's morph alias, the link type a row stores when it points at another row, worked out from where the model
 * lives and never written by hand: core.<area>.<model> for App\Models\<Area> and
 * core.<module>.<model> for App\<Module>\Models, and <domain>.<model> for the Models folder of a domain, in kebab case.
 */
final readonly class MorphAliases
{
    /** The folders of the core models, as FolderClasses reads them. */
    private const array CORE_FOLDERS = [
        'app/Models',
        'app/Models/*',
        'app/*/Models',
    ];

    /**
     * Every core model by its alias.
     *
     * @return array<string, class-string<Model>>
     */
    public static function core(): array
    {
        $map = [];

        foreach (self::CORE_FOLDERS as $folder) {
            $path = base_path($folder);

            foreach (FolderClasses::in($path, Model::class) as $class) {
                $place = array_diff(array_slice(explode('\\', $class), 1, -1), ['Models']);
                $areas = array_map(fn (string $area) => Str::kebab($area), $place);
                $alias = implode('.', [
                    'core',
                    ...$areas,
                    self::modelName($class),
                ]);
                $map[$alias] = $class;
            }
        }

        return $map;
    }

    /**
     * Every model of a domain's Models folder by its alias.
     *
     * @return array<string, class-string<Model>>
     */
    public static function ofDomain(DomainEntry $domain): array
    {
        $map = [];
        $prefix = Str::kebab($domain->name);

        foreach (FolderClasses::in("{$domain->folder}/Models", Model::class) as $class) {
            $model = self::modelName($class);
            $map["{$prefix}.{$model}"] = $class;
        }

        return $map;
    }

    /**
     * The model's own part of its alias: its class name in kebab case.
     */
    private static function modelName(string $class): string
    {
        $name = class_basename($class);

        return Str::kebab($name);
    }
}
