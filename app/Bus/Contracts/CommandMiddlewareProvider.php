<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Bus\MiddlewareDeclaration;

/**
 * A domain or module that adds middleware to the bus, for all commands, one command or one owner's commands.
 */
interface CommandMiddlewareProvider
{
    /**
     * @return list<MiddlewareDeclaration>
     */
    public function commandMiddleware(): array;
}
