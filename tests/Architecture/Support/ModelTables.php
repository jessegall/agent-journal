<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Support\ReflectedType;
use Illuminate\Database\Eloquent\Model;
use Tests\Support\ScanCache\ScanCache;

/**
 * The table of every model class in a set of files, read from the model itself as Laravel resolves it.
 */
final class ModelTables
{
    /**
     * @param  list<string>  $files
     * @return list<TableUse>
     */
    public static function in(array $files): array
    {
        $uses = [];

        foreach (ScanCache::findingsByFile(new ClassesDeclared(), $files) as $path => $classes) {
            foreach ($classes as $name) {
                if (! ReflectedType::factory()->isSubclassOf($name, Model::class)) {
                    continue;
                }

                $model = ReflectedType::of($name);

                if ($model->isAbstract()) {
                    continue;
                }

                $uses[] = new TableUse(
                    $path,
                    $model->startLine(),
                    new $name()->getTable(),
                    TableType::ModelTable,
                );
            }
        }

        return $uses;
    }
}
