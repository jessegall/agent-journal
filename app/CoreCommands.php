<?php

declare(strict_types=1);

namespace App;

use App\Bus\Contracts\Command;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\MiddlewareDeclaration;

/**
 * Core's own commands and middleware, read at start-up beside the domains' (doc 19, section 6.1).
 */
final class CoreCommands
{
    /**
     * @return list<class-string<Command<mixed>>>
     */
    public static function commands(): array
    {
        return [];
    }

    /**
     * @return list<MiddlewareDeclaration>
     */
    public static function middleware(): array
    {
        return [];
    }

    /**
     * Core as an owner of commands: everything on CoreApi's list is exported to the domains.
     */
    public static function owner(): CommandOwner
    {
        return new CommandOwner(
            name: CommandOwner::CORE,
            namespace: __NAMESPACE__,
            domainClass: CommandOwner::CORE,
            commands: self::commands(),
            middleware: self::middleware(),
            requires: [],
            exports: CoreApi::exports(),
        );
    }
}
