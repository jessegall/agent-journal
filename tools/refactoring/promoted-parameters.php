<?php

declare(strict_types=1);

use PhpParser\Node;

/*
 * The question both name scripts in this folder ask of a constructor parameter.
 */

/**
 * Whether the constructor parameter is promoted to a property, with a plain variable name.
 */
function isPromoted(Node\Param $param): bool
{
    return $param->flags !== 0 && $param->var instanceof Node\Expr\Variable && is_string($param->var->name);
}
