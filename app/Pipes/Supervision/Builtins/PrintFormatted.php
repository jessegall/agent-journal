<?php

declare(strict_types=1);

namespace App\Pipes\Supervision\Builtins;

use App\Contracts\Bus\Pipe;
use App\Enums\Runs\ExitStatus;
use App\Support\Execution\BuiltinCall;
use App\Support\Execution\BuiltinEnded;

/**
 * printf: applies its format to its arguments, again for each set of arguments left over, as the shell's printf
 * does; %s, %d and %% are run.
 */
final readonly class PrintFormatted implements Pipe
{
    public function handle(BuiltinCall $call): BuiltinEnded
    {
        [$format, $arguments] = [
            $call->arguments[0],
            array_slice($call->arguments, 1),
        ];

        $pattern = strtr($format, ['\\n' => "\n", '\\t' => "\t", '\\\\' => '\\']);

        $perPass = max(1, preg_match_all('/%[sd]/', $pattern));
        $printed = '';

        do {
            $pass = array_splice($arguments, 0, $perPass);

            $printed .= (string) preg_replace_callback('/%([sd%])/', function (array $match) use (&$pass): string {
                return match ($match[1]) {
                    '%' => '%',
                    'd' => (string) (int) (array_shift($pass) ?? 0),
                    default => (string) (array_shift($pass) ?? ''),
                };
            }, $pattern);
        } while ($arguments !== []);

        return $call->ended(ExitStatus::Success->status(), $call->context(), $printed);
    }
}
