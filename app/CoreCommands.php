<?php

declare(strict_types=1);

namespace App;

use App\CommandMiddleware\AnnounceUnavailableStart;
use App\CommandMiddleware\CommitHeldStartRefusals;
use App\CommandMiddleware\GuardTickOrigin;
use App\CommandMiddleware\KeepStartReceipt;
use App\Commands\Agents\ContinueStart\ContinueStartCommand;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Bus\Command;
use App\Support\CommandOwner;
use App\Support\CommandScope;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Support\MiddlewareDeclaration;

/**
 * Core's own commands and middleware, read at start-up beside the domains'.
 */
final class CoreCommands
{
    /**
     * @return list<class-string<Command<mixed>>>
     */
    public static function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands/*/*', Command::class);
    }

    /**
     * @return list<MiddlewareDeclaration>
     */
    public static function middleware(): array
    {
        return [
            MiddlewareDeclaration::around(CommitHeldStartRefusals::class, CommandScope::all()),
            MiddlewareDeclaration::around(KeepStartReceipt::class, CommandScope::command(StartAgentCommand::class)),
            ...self::startRefusalAnnouncements(),
            MiddlewareDeclaration::inside(GuardTickOrigin::class, CommandScope::all()),
        ];
    }

    /**
     * Around each start command's transaction, a start no account can run is announced to its owner.
     *
     * @return list<MiddlewareDeclaration>
     */
    private static function startRefusalAnnouncements(): array
    {
        return array_map(
            fn (string $start) => MiddlewareDeclaration::around(
                AnnounceUnavailableStart::class,
                CommandScope::command($start),
            ),
            [StartAgentCommand::class, OpenAgentRuntimeCommand::class, ContinueStartCommand::class],
        );
    }

    /**
     * Core as an owner of commands: every core command and class may be used by the domains.
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
            exports: Exports::everythingIn(__NAMESPACE__),
        );
    }
}
