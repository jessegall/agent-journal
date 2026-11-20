<?php

declare(strict_types=1);

namespace App\Scripts\Support;

use App\Scripts\Enums\DiagnosticCode;
use App\Scripts\Exceptions\ScriptSyntaxError;
use App\Scripts\Values\ScriptLine;
use App\Scripts\Values\ScriptRange;

final class ScriptCursor
{
    private const int STATEMENT_LIMIT = 64;

    private int $position = 0;

    private int $statements = 0;

    /**
     * @param  list<ScriptLine>  $lines
     */
    public function __construct(private readonly array $lines) {}

    public function current(): ScriptLine|null
    {
        return $this->lines[$this->position] ?? null;
    }

    public function advance(): void
    {
        $this->position++;
    }

    public function countStatement(ScriptRange $source): void
    {
        $this->statements++;

        if ($this->statements > self::STATEMENT_LIMIT) {
            throw ScriptSyntaxError::at(DiagnosticCode::StatementLimit, $source, 'A script may have 64 statements.');
        }
    }
}
