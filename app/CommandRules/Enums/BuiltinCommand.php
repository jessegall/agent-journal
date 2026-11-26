<?php

declare(strict_types=1);

namespace App\CommandRules\Enums;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Pipes\Supervision\Builtins\ChangeFolder;
use App\CommandRules\Pipes\Supervision\Builtins\EchoWords;
use App\CommandRules\Pipes\Supervision\Builtins\ExportVariables;
use App\CommandRules\Pipes\Supervision\Builtins\Fail;
use App\CommandRules\Pipes\Supervision\Builtins\PrintFormatted;
use App\CommandRules\Pipes\Supervision\Builtins\PrintWorkingFolder;
use App\CommandRules\Pipes\Supervision\Builtins\Succeed;
use App\CommandRules\Pipes\Supervision\Builtins\UnsetVariables;

/**
 * A shell builtin the supervisor runs itself, and the pipe that runs it.
 */
enum BuiltinCommand: string
{
    case ChangeFolder = 'cd';
    case PrintWorkingFolder = 'pwd';
    case True = 'true';
    case NoOperation = ':';
    case False = 'false';
    case Export = 'export';
    case Unset = 'unset';
    case Echo = 'echo';
    case Printf = 'printf';

    /**
     * @return class-string<Pipe>
     */
    public function pipe(): string
    {
        return match ($this) {
            self::ChangeFolder => ChangeFolder::class,
            self::PrintWorkingFolder => PrintWorkingFolder::class,
            self::True, self::NoOperation => Succeed::class,
            self::False => Fail::class,
            self::Export => ExportVariables::class,
            self::Unset => UnsetVariables::class,
            self::Echo => EchoWords::class,
            self::Printf => PrintFormatted::class,
        };
    }
}
