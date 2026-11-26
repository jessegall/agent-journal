<?php

declare(strict_types=1);

namespace Tests\Machinery\Bus;

use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Bus\CommandScope;
use App\Bus\MiddlewareDeclaration;
use App\CoreCommands;
use App\Sessions\Commands\RecordUserHeartbeat\RecordUserHeartbeatCommand;
use App\Support\CommandRegistry;
use Domain\Rules\RulesDomain;
use Domain\Sharing\SharingDomain;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordAll;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMachinery;

/**
 * Core's own commands: a module uses them without declaring Core, every one but Core's private
 * runtime commands is exported, and a scope owned by Core covers exactly them.
 */
#[TestsMachinery(CoreCommands::class)]
final class CoreCommandsTest extends CommandBusTestCase
{
    private const string EVERY_CLASS = "Every class of a Core Commands folder is one of Core's commands.";

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class, SharingDomain::class);
    }

    public function test_core_lists_its_commands_and_exports_them(): void
    {
        $this->installCommandModules();
        $registry = $this->app->make(CommandRegistry::class);

        $commandFiles = [
            ...glob(app_path('*/Commands/*/*Command.php')) ?: [],
            ...glob(app_path('*/*/Commands/*/*Command.php')) ?: [],
        ];

        $this->assertCount(
            count($commandFiles),
            CoreCommands::commands(),
            self::EVERY_CLASS,
        );
        $this->assertContains(StartAgentCommand::class, CoreCommands::commands());
        $this->assertContains(RecordUserHeartbeatCommand::class, CoreCommands::commands());

        foreach (CoreCommands::commands() as $command) {
            $this->assertTrue($registry->has($command));
            $this->assertTrue($registry->isExported($command), $command);
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
        ) && count(
            array_filter(
                $registry->middlewareFor($command),
                fn ($entry) => $entry->middlewareClass() === RecordAll::class,
            ),
        ) === 2));

        sort($covered);
        $expected = CoreCommands::commands();
        sort($expected);

        $this->assertSame($expected, $covered);
    }
}
