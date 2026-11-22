<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A package script as written: its binding and its body lines, each a shell line, an @-reference or a callback.
 */
final readonly class ScriptBody
{
    /**
     * @param  list<string>  $lines
     */
    public function __construct(public ScriptBinding $binding, public array $lines) {}
}
