<?php

declare(strict_types=1);

namespace App;

use App\Agents\Commands\RetireAgent;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Commands\ReassignRecord;
use App\Assignments\Commands\UnassignRecord;
use App\Bus\Contracts\Command;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\MiddlewareDeclaration;
use App\Comments\Commands\PostComment;
use App\Comments\Commands\PostTextComment;
use App\Communication\Commands\AnswerMessage;
use App\Communication\Commands\DismissMessage;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Commands\SendMessage;
use App\Numbers\Commands\InstallNumbers;
use App\Records\Commands\LinkRecords;
use App\Records\Commands\UnlinkRecords;

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
        return [AssignRecord::class, ReassignRecord::class, UnassignRecord::class, RetireAgent::class, InstallNumbers::class, LinkRecords::class, UnlinkRecords::class, PostComment::class, PostTextComment::class, SendMessage::class, AnswerMessage::class, DismissMessage::class, RequireMessageAnswer::class];
    }

    /**
     * @return list<MiddlewareDeclaration>
     */
    public static function middleware(): array
    {
        return [];
    }

    /**
     * Core as an owner of commands: the commands on CoreApi's commands list are exported to the domains.
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
