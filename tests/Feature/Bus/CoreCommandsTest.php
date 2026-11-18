<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Agents\Commands\ChangeAgentEffort;
use App\Agents\Commands\ChangeAgentModel;
use App\Agents\Commands\ClaimDriverRequests;
use App\Agents\Commands\ClaimLaunchGrant;
use App\Agents\Commands\DeliverAgent;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\InterruptAgent;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Commands\OpenHostMainRuntime;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Commands\ReportDriverTurn;
use App\Agents\Commands\ReportRequestProgress;
use App\Agents\Commands\ReportRuntimeActivity;
use App\Agents\Commands\ReportRuntimeExit;
use App\Agents\Commands\ReportRuntimeHeartbeat;
use App\Agents\Commands\RetireAgent;
use App\Agents\Commands\StopAgent;
use App\Agents\Commands\WakeAgent;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Commands\ReassignRecord;
use App\Assignments\Commands\UnassignRecord;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Comments\Commands\PostComment;
use App\Comments\Commands\PostTextComment;
use App\Communication\Commands\AnswerMessage;
use App\Communication\Commands\DismissMessage;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Commands\SendMessage;
use App\CoreCommands;
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
use App\Sharing\Commands\ApproveShareRequest;
use App\Sharing\Commands\CreateShare;
use App\Sharing\Commands\ExpireShares;
use App\Sharing\Commands\ReadShare;
use App\Sharing\Commands\RequestShare;
use App\Sharing\Commands\RevokeShare;
use App\Sharing\Commands\SaveSharePreview;
use App\Web\Commands\RecordUserHeartbeat;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordAll;

/**
 * Core's own commands (doc 19, phase 5): a module uses them without declaring Core, every one but Core's private
 * runtime commands is exported, and a scope owned by Core covers exactly them.
 */
final class CoreCommandsTest extends CommandBusTestCase
{
    public function test_core_lists_its_commands_and_exports_them(): void
    {
        $this->installCommandModules();
        $registry = $this->app->make(CommandRegistry::class);

        $this->assertSame([AssignRecord::class, ReassignRecord::class, UnassignRecord::class, RetireAgent::class, EnrollHost::class, OpenAgentRuntime::class, DeliverAgent::class, WakeAgent::class, ChangeAgentModel::class, ChangeAgentEffort::class, InterruptAgent::class, StopAgent::class, ClaimDriverRequests::class, ClaimLaunchGrant::class, ReportRuntimeActivity::class, ReportRequestProgress::class, ReportDriverTurn::class, ReportRuntimeHeartbeat::class, ReportRuntimeExit::class, OpenHostMainRuntime::class, RecordHeartbeat::class, RecordUserHeartbeat::class, MarkSilentSessions::class, SettleFrameTimes::class, InstallNumbers::class, LinkRecords::class, UnlinkRecords::class, PostComment::class, PostTextComment::class, SendMessage::class, AnswerMessage::class, DismissMessage::class, RequireMessageAnswer::class, SetStringSetting::class, SetBooleanSetting::class, SetIntegerSetting::class, SetDecimalSetting::class, SetStringChoice::class, SetIntegerChoice::class, ResetSetting::class, EnableSettingGroup::class, DisableSettingGroup::class, ResetSettingGroup::class, SaveSharePreview::class, CreateShare::class, RequestShare::class, ApproveShareRequest::class, RevokeShare::class, ReadShare::class, ExpireShares::class], CoreCommands::commands());

        foreach (CoreCommands::commands() as $command) {
            $this->assertTrue($registry->has($command));
            $this->assertSame(! in_array($command, CoreCommands::privateCommands(), true), $registry->isExported($command), $command);
        }

        $this->assertSame([ReadShare::class, ExpireShares::class], CoreCommands::privateCommands());
    }

    public function test_a_scope_owned_by_core_covers_exactly_cores_commands(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(RecordAll::class, CommandScope::ownedByCore()));
        $registry = $this->app->make(CommandRegistry::class);
        $covered = array_values(array_filter(array_keys($registry->handlerMap()), fn (string $command) => in_array(
            RecordAll::class,
            array_map(fn ($entry) => $entry->middlewareClass(), $registry->middlewareFor($command)),
            true,
        ) && count(array_filter($registry->middlewareFor($command), fn ($entry) => $entry->middlewareClass() === RecordAll::class)) === 2));

        sort($covered);
        $expected = CoreCommands::commands();
        sort($expected);

        $this->assertSame($expected, $covered);
    }
}
