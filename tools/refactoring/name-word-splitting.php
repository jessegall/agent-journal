<?php

declare(strict_types=1);

/**
 * The words of a name, split at each capital, underscore and digit run, in lower case.
 *
 * @return list<string>
 */
function wordsOf(string $name): array
{
    $bare = preg_replace('/^.*::/', '', ltrim($name, '$'));
    $spaced = preg_replace(['/([a-z0-9])([A-Z])/', '/([A-Z]+)([A-Z][a-z])/', '/[_()]+/'], ['$1 $2', '$1 $2', ' '], (string) $bare);

    return array_values(array_filter(explode(' ', strtolower((string) $spaced))));
}
