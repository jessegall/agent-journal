<?php

declare(strict_types=1);

/**
 * Reads the marked sections of a class, shared by the section checks of models and states.
 */

use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;

const MARKER = '/^\s*\/\/ -+\[ (\w+) \]-+\s*$/';

/**
 * The faults of a class's sections as "line<TAB>fault": an unknown section name, a section written twice or out of
 * order, and what the method check says of each method in the section it sits in (none above the first marker).
 *
 * @param  list<string>  $order
 * @param  Closure(ClassMethod, string|null): (string|null)  $methodFault
 * @return list<string>
 */
function sectionFaults(string $source, Class_ $class, array $order, Closure $methodFault): array
{
    $faults = [];
    $lines = explode("\n", $source);
    $seen = [];
    $section = null;
    $methods = [];

    foreach ($class->getMethods() as $method) {
        $methods[$method->getStartLine()] = $method;
    }

    for ($line = $class->getStartLine(); $line <= $class->getEndLine(); $line++) {
        if (preg_match(MARKER, $lines[$line - 1], $match) === 1) {
            $name = $match[1];
            $place = array_search($name, $order, true);

            if ($place === false) {
                $faults[] = "{$line}\tunknown section {$name}";
            } elseif (in_array($name, $seen, true)) {
                $faults[] = "{$line}\tsection {$name} written twice";
            } elseif ($seen !== [] && $place < array_search(end($seen), $order, true)) {
                $faults[] = "{$line}\tsection {$name} comes before ".end($seen);
            }

            $seen[] = $name;
            $section = $name;
        }

        if (! isset($methods[$line])) {
            continue;
        }

        $fault = $methodFault($methods[$line], $section);

        if ($fault !== null) {
            $faults[] = "{$line}\t{$fault}";
        }
    }

    return $faults;
}
