<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Values\ScriptKeywordDefinition;

/**
 * One trigger's handler as the parser read it: the trigger keyword, where it stands in the source and its statements.
 */
final readonly class ParsedHandler
{
    /**
     * @param  list<ParsedStatement>  $statements
     */
    public function __construct(
        public ScriptKeywordDefinition $trigger,
        public ScriptRange $source,
        public array $statements,
    ) {}
}
