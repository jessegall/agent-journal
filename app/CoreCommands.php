<?php

declare(strict_types=1);

namespace App;

use App\CommandMiddleware\AnnounceUnavailableStart;
use App\CommandMiddleware\CommitHeldStartRefusals;
use App\CommandMiddleware\GuardTickOrigin;
use App\CommandMiddleware\KeepStartReceipt;
use App\CommandMiddleware\RefuseWritesDuringEvaluation;
use App\Commands\ContinueStart\ContinueStartCommand;
use App\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\StartAgent\StartAgentCommand;
use App\Contracts\Bus\Command;
use App\Support\CommandOwner;
use App\Support\CommandScope;
use App\Support\FolderClasses;
use App\Support\MiddlewareDeclaration;

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
        return FolderClasses::in(__DIR__.'/Commands/*', Command::class);
    }

    /**
     * Core's commands that stay private: registered for Core's own runtime, such as the system's public share read,
     * share expiry and the gateway supervisor's claims and reports, and never exported to a domain or module.
     *
     * @return list<class-string<Command<mixed>>>
     */
    public static function privateCommands(): array
    {
        return array_values(array_diff(self::commands(), CoreApi::exports()->commands));
    }

    /**
     * @return list<MiddlewareDeclaration>
     */
    public static function middleware(): array
    {
        return [
            MiddlewareDeclaration::around(RefuseWritesDuringEvaluation::class, CommandScope::all()),
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
     * Core as an owner of commands: the commands on CoreApi's commands list are exported to the domains; the private
     * ones are not.
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
