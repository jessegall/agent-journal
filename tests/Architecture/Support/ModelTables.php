<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Stmt\Class_;
use PhpParser\NodeFinder;
use ReflectionClass;

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

        foreach ($files as $path) {
            $file = ParsedFile::fromPath($path);

            foreach ((new NodeFinder)->findInstanceOf($file->statements, Class_::class) as $class) {
                $name = $class->namespacedName?->toString();

                if ($name === null || ! is_subclass_of($name, Model::class) || (new ReflectionClass($name))->isAbstract()) {
                    continue;
                }

                $uses[] = new TableUse($path, $class->getStartLine(), (new $name)->getTable(), TableType::ModelTable);
            }
        }

        return $uses;
    }
}
