<?php

declare(strict_types=1);

namespace App\Scripts\Exceptions;

use App\Profiles\Data\ScriptDiagnostic;
use App\Scripts\Enums\DiagnosticCode;
use App\Scripts\Values\ScriptRange;
use RuntimeException;

final class ScriptSyntaxError extends RuntimeException
{
    private function __construct(public readonly ScriptDiagnostic $diagnostic)
    {
        parent::__construct($diagnostic->message);
    }

    public static function at(DiagnosticCode $code, ScriptRange $range, string $message, string $expected = ''): self
    {
        return new self(ScriptDiagnostic::from([
            'code' => $code->value,
            'message' => $message,
            'line' => $range->line,
            'column' => $range->column,
            'length' => $range->length,
            'expectedForm' => $expected,
        ]));
    }
}
