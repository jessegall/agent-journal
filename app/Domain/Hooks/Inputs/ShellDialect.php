<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

enum ShellDialect: string
{
    case Bash = 'bash';
    case Zsh = 'zsh';
    case Sh = 'sh';
}
