<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\DiagnosticCode;
use App\Exceptions\ScriptSyntaxError;
use App\Values\ScriptLine;
use App\Values\ScriptRange;

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
