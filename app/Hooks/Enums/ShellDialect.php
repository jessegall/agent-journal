<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

enum ShellDialect: string
{
    case Bash = 'bash';
    case Zsh = 'zsh';
    case Sh = 'sh';
}
