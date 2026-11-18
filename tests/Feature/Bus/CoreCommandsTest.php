<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Actors\Commands\RecordUserHeartbeat;
use App\Agents\Commands\MarkSilentSessions;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Commands\RetireAgent;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Commands\ReassignRecord;
use App\Assignments\Commands\UnassignRecord;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Comments\Commands\PostComment;
use App\Comments\Commands\PostTextComment;
use App\CoreCommands;
use App\Numbers\Commands\InstallNumbers;
use App\Records\Commands\LinkRecords;
use App\Records\Commands\UnlinkRecords;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordAll;

/**
 * Core's own commands (doc 19, phase 5): a module uses them without declaring Core, and a scope owned by Core covers
 * exactly them.
 */
final class CoreCommandsTest extends CommandBusTestCase
{
    public function test_core_lists_its_twelve_commands_and_exports_them(): void
    {
        $this->installCommandModules();
        $registry = $this->app->make(CommandRegistry::class);

        $this->assertSame([AssignRecord::class, ReassignRecord::class, UnassignRecord::class, RetireAgent::class, RecordHeartbeat::class, RecordUserHeartbeat::class, MarkSilentSessions::class, InstallNumbers::class, LinkRecords::class, UnlinkRecords::class, PostComment::class, PostTextComment::class], CoreCommands::commands());

        foreach (CoreCommands::commands() as $command) {
            $this->assertTrue($registry->has($command));
            $this->assertTrue($registry->isExported($command));
        }
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
