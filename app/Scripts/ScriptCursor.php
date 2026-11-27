<?php

declare(strict_types=1);

namespace App\Scripts;

use App\Profiles\Enums\DiagnosticCode;
use App\Scripts\Exceptions\ScriptCursorPastEnd;
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

    public function isAtEnd(): bool
    {
        return ! isset($this->lines[$this->position]);
    }

    /**
     * @throws ScriptCursorPastEnd
     */
    public function current(): ScriptLine
    {
        return $this->lines[$this->position] ?? throw ScriptCursorPastEnd::at($this->position);
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
