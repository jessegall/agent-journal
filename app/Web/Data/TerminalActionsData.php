<?php

declare(strict_types=1);

namespace App\Web\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The addresses of the actions the viewer may take on a terminal, each present only when the server offers it and the
 * viewer is authorized: interrupting what runs in it, restarting its session and ending it.
 */
#[TypeScript]
final class TerminalActionsData extends Data
{
    public function __construct(
        public readonly string|Optional $interrupt = new Optional(),
        public readonly string|Optional $restart = new Optional(),
        public readonly string|Optional $end = new Optional(),
    ) {}
}
