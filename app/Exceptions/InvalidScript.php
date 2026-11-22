<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CommandRefusal;
use App\Data\ScriptDiagnostic;
use RuntimeException;

final class InvalidScript extends RuntimeException implements CommandRefusal
{
    /**
     * @param  list<ScriptDiagnostic>  $diagnostics
     */
    private function __construct(public readonly array $diagnostics)
    {
        parent::__construct('The profile script cannot be activated.');
    }

    /**
     * @param  list<ScriptDiagnostic>  $diagnostics
     */
    public static function withDiagnostics(array $diagnostics): self
    {
        return new self($diagnostics);
    }
}
