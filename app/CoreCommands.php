<?php

declare(strict_types=1);

namespace App;

use App\Agents\Commands\ContinueStart\ContinueStartCommand;
use App\Agents\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Bus\CommandOwner;
use App\Bus\CommandScope;
use App\Bus\Contracts\Command;
use App\Bus\MiddlewareDeclaration;
use App\CommandMiddleware\AnnounceUnavailableStart;
use App\CommandMiddleware\AskRawBytes;
use App\CommandMiddleware\CommitHeldStartRefusals;
use App\CommandMiddleware\GuardTickOrigin;
use App\CommandMiddleware\KeepStartReceipt;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Support\Codebase;
use App\Support\Exports;

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
        // Each subject keeps its commands in its own Commands folder, one or two levels down (app/Agents/Drivers).
        return [
            ...Codebase::in(__DIR__.'/*/Commands/*', Command::class),
            ...Codebase::in(__DIR__.'/*/*/Commands/*', Command::class),
        ];
    }

    /**
     * @return list<MiddlewareDeclaration>
     */
    public static function middleware(): array
    {
        return [
            MiddlewareDeclaration::around(CommitHeldStartRefusals::class, CommandScope::all()),
            MiddlewareDeclaration::around(KeepStartReceipt::class, CommandScope::command(StartAgentCommand::class)),
            MiddlewareDeclaration::around(AskRawBytes::class, CommandScope::command(OpenHostProcessCommand::class)),
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
