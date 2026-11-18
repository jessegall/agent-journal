<?php

declare(strict_types=1);

namespace App;

use App\Agents\Commands\RecordHeartbeat;
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
use App\Engine\Commands\MarkSilentSessions;
use App\Engine\Commands\SettleFrameTimes;
use App\Numbers\Commands\InstallNumbers;
use App\Records\Commands\LinkRecords;
use App\Records\Commands\UnlinkRecords;
use App\Settings\Commands\DisableSettingGroup;
use App\Settings\Commands\EnableSettingGroup;
use App\Settings\Commands\ResetSetting;
use App\Settings\Commands\ResetSettingGroup;
use App\Settings\Commands\SetBooleanSetting;
use App\Settings\Commands\SetDecimalSetting;
use App\Settings\Commands\SetIntegerChoice;
use App\Settings\Commands\SetIntegerSetting;
use App\Settings\Commands\SetStringChoice;
use App\Settings\Commands\SetStringSetting;
use App\Sharing\Commands\ReadShare;
use App\Sharing\Commands\SaveSharePreview;
use App\Web\Commands\RecordUserHeartbeat;

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
        return [
            AssignRecord::class, ReassignRecord::class, UnassignRecord::class, RetireAgent::class, RecordHeartbeat::class, RecordUserHeartbeat::class, MarkSilentSessions::class, SettleFrameTimes::class, InstallNumbers::class, LinkRecords::class, UnlinkRecords::class, PostComment::class, PostTextComment::class,
            SendMessage::class, AnswerMessage::class, DismissMessage::class, RequireMessageAnswer::class,
            SetStringSetting::class, SetBooleanSetting::class, SetIntegerSetting::class, SetDecimalSetting::class, SetStringChoice::class, SetIntegerChoice::class, ResetSetting::class, EnableSettingGroup::class, DisableSettingGroup::class, ResetSettingGroup::class,
            SaveSharePreview::class,
            ReadShare::class,
        ];
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
