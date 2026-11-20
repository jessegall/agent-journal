<?php

declare(strict_types=1);

/**
 * What the model scripts share: the PHP files under a path, and whether a parsed class is an Eloquent model.
 */

use PhpParser\Node\Stmt\Class_;

const MODEL_PARENTS = ['Model', 'Pivot', 'MorphPivot', 'Authenticatable', 'PackagePasskey'];

/**
 * What a static model method's body does when it makes a row.
 */
const ROW_MAKES = '/(self|static)::(create|forceCreate|firstOrCreate|updateOrCreate|insert)\(|->(save|create)\(|new (self|static)\b/';

/**
 * What a body does when it saves one new row of its own model: builds it, itself or through a builder of its own,
 * and saves it, or creates it.
 */
const ROW_SAVES_NEW = '/(new (self|static)\b|(self|static)::\w+\()[\s\S]*->save(For)?\(|(self|static)::query\(\)->create\(/';

/**
 * What a body does when it is no constructor of one new row: it may hand back a row that exists, writes several
 * rows or only some, or changes a row it locked first.
 */
const ROW_NOT_ONE_NEW = '/firstOr|->first\(|->sole\(|->find\(|lock|firstOrCreate|updateOrCreate|createOrFirst|\?\?|'
    .'insert(OrIgnore)?\(|foreach|->delete\(/';

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
