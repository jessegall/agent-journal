<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Bus\Support\MiddlewareDeclaration;

/**
 * A domain or module that adds middleware to the bus, for all commands, one command or one owner's commands.
 */
interface ProvidesCommandMiddleware
{
    /**
     * @return list<MiddlewareDeclaration>
     */
    public function commandMiddleware(): array;
}
