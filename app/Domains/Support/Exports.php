<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Domains\Exceptions\InvalidExports;

/**
 * Checks a list of exports when the application starts: a plain list of class names, none twice (compared without
 * regard to case), each inside its owner's namespace. It reads no source file; whether each export may be public is
 * the architecture suite's question.
 */
final class Exports
{
    /**
     * @param  array<array-key, mixed>  $exports
     * @return list<string>
     */
    public static function check(string $owner, string $namespace, array $exports): array
    {
        if (! array_is_list($exports)) {
            throw InvalidExports::notAList($owner);
        }

        $seen = [];

        foreach ($exports as $position => $name) {
            if (! is_string($name) || $name === '') {
                throw InvalidExports::notAName($owner, $position);
            }

            $name = ltrim($name, '\\');

            if (stripos($name, $namespace.'\\') !== 0) {
                throw InvalidExports::outsideOwner($owner, $name, $namespace);
            }

            if (array_key_exists(strtolower($name), $seen)) {
                throw InvalidExports::listedTwice($owner, $name);
            }

            $seen[strtolower($name)] = $name;
        }

        return array_values($seen);
    }
}
