<?php

declare(strict_types=1);

/**
 * The one funnel every PHP parse of the refactoring tools goes through: a file is parsed once per run, and a second
 * parse of it stops the run, so no tool can parse the project again for each item of a list.
 */

use PhpParser\Node;
use PhpParser\Parser;

/**
 * @return list<Node>
 */
function parsedOnce(Parser $parser, string $file, string $code): array
{
    static $parsed = [];

    if (isset($parsed[$file])) {
        throw new LogicException("{$file} would be parsed a second time; a run works on its one parse of each file.");
    }

    $parsed[$file] = true;

    return $parser->parse($code) ?? [];
}
