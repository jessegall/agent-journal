<?php

declare(strict_types=1);

/**
 * What the model scripts share: the PHP files under a path, and whether a parsed class is an Eloquent model.
 */

use PhpParser\Node\Stmt\Class_;

const MODEL_PARENTS = ['Model', 'Pivot', 'MorphPivot', 'Authenticatable', 'PackagePasskey'];

/**
 * @return list<string>
 */
function phpFiles(string $path): array
{
    if (is_file($path)) {
        return [$path];
    }

    $files = [];
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS));

    foreach ($iterator as $file) {
        if ($file->getExtension() === 'php') {
            $files[] = $file->getPathname();
        }
    }

    sort($files);

    return $files;
}

function isModel(Class_ $class): bool
{
    return $class->extends !== null && in_array($class->extends->getLast(), MODEL_PARENTS, true);
}
