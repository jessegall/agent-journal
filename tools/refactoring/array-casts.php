<?php

declare(strict_types=1);

/**
 * Lists the model columns cast to a plain array whose type, stated in casts()'s doc comment as "@column <name>
 * <type>", holds more than scalars or is not stated: an array shape, a nested list or a mixed value. Such a column is
 * cast to Laravel Data, the Data class for one object or DataCollection::class.':'.ItemData::class for a list of them,
 * so the model hands back typed objects. A list or map of scalars keeps its array cast.
 *
 *   php tools/refactoring/array-casts.php app domain
 *       prints "file:line<TAB>column <name> ..." for each such column, and fails while there is one.
 */

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';

/** The array casts Laravel writes as a plain string. */
const ARRAY_CASTS = '/\'(\w+)\' => \'(array|json|object|collection|encrypted:array|encrypted:collection)\'/';

/** A documented type that holds only scalars: a list or a map of strings, ints, floats or bools, maybe null. */
const SCALAR_ARRAY = '/^(?:list|array|non-empty-list|non-empty-array)<(?:(?:string|int|array-key), ?)?'
    .'(?:string|int|float|bool|non-empty-string|positive-int|non-negative-int)>(?:\|null)?$/';

$faultCount = 0;

foreach (array_slice($argv, 1) as $path) {
    foreach (phpFiles($path) as $file) {
        $source = file_get_contents($file);

        if (! str_contains($source, 'function casts(')) {
            continue;
        }

        preg_match_all(ARRAY_CASTS, $source, $casts, PREG_SET_ORDER | PREG_OFFSET_CAPTURE);

        foreach ($casts as [$line, $column]) {
            $documented = columnType($source, $column[0]);

            if (preg_match(SCALAR_ARRAY, $documented) === 1) {
                continue;
            }

            $number = substr_count(substr($source, 0, $line[1]), "\n") + 1;
            $faultCount++;
            echo "{$file}:{$number}\tcolumn {$column[0]} is cast to an array of {$documented}: cast it to a Data class or "
                ."a collection of one\n";
        }
    }
}

exit($faultCount === 0 ? 0 : 1);

/**
 * The type the casts() doc comment states for a column, as "@column <name> <type>": the one place an array column's
 * items are named, which composer models:docs writes into the model's @property line.
 */
function columnType(string $source, string $column): string
{
    if (preg_match('/@column '.$column.' (\S+)/', $source, $type) !== 1) {
        return 'no stated type';
    }

    return $type[1];
}
