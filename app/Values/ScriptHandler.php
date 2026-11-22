<?php

declare(strict_types=1);

namespace App\Values;

final readonly class ScriptHandler
{
    /**
     * @param  list<ParsedStatement>  $statements
     */
    public function __construct(
        public KeywordDefinition $trigger,
        public ScriptRange $source,
        public array $statements,
    ) {}
}
