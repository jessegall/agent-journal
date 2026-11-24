<?php

declare(strict_types=1);

namespace App\Enums;

use App\Contracts\Bus\Pipe;
use App\Pipes\Supervision\Builtins\ChangeFolder;
use App\Pipes\Supervision\Builtins\EchoWords;
use App\Pipes\Supervision\Builtins\ExportVariables;
use App\Pipes\Supervision\Builtins\Fail;
use App\Pipes\Supervision\Builtins\PrintFormatted;
use App\Pipes\Supervision\Builtins\PrintWorkingFolder;
use App\Pipes\Supervision\Builtins\Succeed;
use App\Pipes\Supervision\Builtins\UnsetVariables;

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
