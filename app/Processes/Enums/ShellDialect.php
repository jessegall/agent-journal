<?php

declare(strict_types=1);

namespace App\Processes\Enums;

enum ShellDialect: string
{
    case Bash = 'bash';
    case Zsh = 'zsh';
    case Sh = 'sh';
}
