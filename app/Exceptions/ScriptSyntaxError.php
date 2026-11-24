<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Data\Profiles\ScriptDiagnostic;
use App\Enums\DiagnosticCode;
use App\Values\ScriptRange;
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
