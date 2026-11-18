<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Illuminate\Database\Eloquent\Model;
use ReflectionClass;
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

        foreach (ScanCache::findingsByFile(new ClassesDeclared, $files) as $path => $classes) {
            foreach ($classes as $name) {
                if (! is_subclass_of($name, Model::class) || ($reflection = new ReflectionClass($name))->isAbstract()) {
                    continue;
                }

                $uses[] = new TableUse($path, (int) $reflection->getStartLine(), (new $name)->getTable(), TableType::ModelTable);
            }
        }

        return $uses;
    }
}
