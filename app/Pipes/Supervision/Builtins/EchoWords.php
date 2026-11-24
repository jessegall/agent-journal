<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\Builtins;

use App\Contracts\Bus\Pipe;
use App\Enums\ExitStatus;
use App\Support\Execution\BuiltinCall;
use App\Support\Execution\BuiltinEnded;

/**
 * echo: prints its words joined by spaces and a newline, or without the newline after -n.
 */
final readonly class EchoWords implements Pipe
{
    private const string NO_NEWLINE = '-n';

    public function handle(BuiltinCall $call): BuiltinEnded
    {
        $words = $call->arguments;
        $hasNewline = ($words[0] ?? null) !== self::NO_NEWLINE;
        $printed = implode(' ', $hasNewline ? $words : array_slice($words, 1)).($hasNewline ? "\n" : '');

        return $call->ended(ExitStatus::Success->status(), $call->context(), $printed);
    }
}
