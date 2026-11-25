<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Attributes\Authorize;
use App\Commands\Agents\RetireAgent\RetireAgentCommand;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Bus\PipelineRunner;
use App\CoreCommands;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\AccessType;
use App\Exceptions\CommandDeclarationInvalid;
use App\Exceptions\CommandHandlerMissing;
use App\Exceptions\CommandListedTwice;
use App\Exceptions\MiddlewareDeclarationInvalid;
use App\Exceptions\MiddlewareListedTwice;
use App\Support\CommandOwner;
use App\Support\CommandRegistry;
use App\Support\CommandScope;
use App\Support\DomainRegistry;
use App\Support\Exports;
use App\Support\MiddlewareDeclaration;
use App\Support\RegisteredMiddleware;
use App\Values\PolicyDefinition;
use Tests\Fixtures\Bus\Garden\CommandMiddleware\Fence;
use Tests\Fixtures\Bus\Garden\Commands\Water\WaterCommand;
use Tests\Fixtures\Bus\Garden\Commands\Water\WaterHandler;
use Tests\Fixtures\Bus\Layouts\Commands\Plant\PlantCommand as FinalPlantCommand;
use Tests\Fixtures\Bus\Layouts\Commands\Plant\PlantHandler as FinalPlantHandler;
use Tests\Fixtures\Bus\Layouts\Garden\Commands\Prune\PruneCommand;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\CommandMiddleware\CheckStock;
use Tests\Fixtures\Bus\Shop\CommandMiddleware\LogShop;
use Tests\Fixtures\Bus\Shop\CommandMiddleware\NotMiddleware;
use Tests\Fixtures\Bus\Shop\Commands\AddItem\AddItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\AddItem\AddItemHandler;
use Tests\Fixtures\Bus\Shop\Commands\ArrayResultItem\ArrayResultItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\BaselessItem\BaselessItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\ClosureItem\ClosureItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\EnumLimitedItem\EnumLimitedItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\LimitedItem\LimitedItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\LookupItem\LookupItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\LooseItem\LooseItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\MisnamedFieldItem\MisnamedFieldItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\MutableLabeledItem\MutableLabeledItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\NoHandlerItem\NoHandlerItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\OpenItem\OpenItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\PartsItem\PartsItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\QueuedItem\QueuedItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\RemoveItem\RemoveItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\RemoveItem\RemoveItemHandler;
use Tests\Fixtures\Bus\Shop\Commands\SingletonItem\SingletonItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\UnbuildableLookupItem\UnbuildableLookupItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\UnreadableRuleItem\UnreadableRuleItemCommand;
use Tests\Fixtures\Bus\Shop\Commands\ValueRuledItem\ValueRuledItemCommand;
use Tests\Fixtures\Bus\Shop\Loose\MisplacedItem;
use Tests\TestCase;

/**
 * Start-up checks every command, handler and middleware declaration and refuses the first wrong one by name; a
 * correct set gives each command its handler, owner, settings and ordered middleware.
 */
final class CommandRegistryTest extends TestCase
{
    public function test_a_correct_command_gets_its_handler_owner_settings_and_ordered_middleware(): void
    {
        $registry = $this->registryOf([
            $this->shop([AddItemCommand::class, RemoveItemCommand::class], [
                MiddlewareDeclaration::inside(CheckStock::class, CommandScope::command(AddItemCommand::class)),
                MiddlewareDeclaration::around(LogShop::class, CommandScope::all()),
            ], exports: [AddItemCommand::class]),
            $this->garden([WaterCommand::class], [MiddlewareDeclaration::around(Fence::class, CommandScope::all())]),
        ]);

        $this->assertSame([
            AddItemCommand::class => AddItemHandler::class,
            RemoveItemCommand::class => RemoveItemHandler::class,
            WaterCommand::class => WaterHandler::class,
        ], $registry->handlerMap());
        $this->assertSame('Shop', $registry->ownerOf(AddItemCommand::class));
        $this->assertTrue($registry->isExported(AddItemCommand::class));
        $this->assertFalse($registry->isExported(RemoveItemCommand::class));
        $this->assertTrue($registry->isRepeatableReadNeeded(AddItemCommand::class));
        $this->assertEquals(
            new Authorize(FixturePolicy::class, AccessType::Create),
            $registry->authorizeOf(AddItemCommand::class),
        );
        $this->assertSame(CommandEntry::Application, $registry->entryOf(AddItemCommand::class));
        $this->assertSame(
            [LogShop::class, Fence::class, CheckStock::class],
            $this->middlewareClassesOf($registry, AddItemCommand::class),
        );
    }

    public function test_the_application_starts_with_the_real_owners(): void
    {
        $registry = $this->app->make(DomainRegistry::class)
            ->commandDeclarations(CoreCommands::owner(), $this->app->make(PipelineRunner::class));

        $this->assertFalse($registry->has(AddItemCommand::class));
    }

    public function test_a_command_exported_but_not_registered_by_its_owner_is_refused(): void
    {
        $this->expectExceptionObject(CommandDeclarationInvalid::exportedButNotRegistered('Shop', RemoveItemCommand::class));

        $this->registryOf([$this->shop([AddItemCommand::class], exports: [RemoveItemCommand::class])]);
    }

    public function test_a_registered_command_that_is_not_exported_stays_private(): void
    {
        $registry = $this->registryOf([$this->shop([AddItemCommand::class, RemoveItemCommand::class], exports: [AddItemCommand::class])]);

        $this->assertTrue($registry->isExported(AddItemCommand::class));
        $this->assertFalse($registry->isExported(RemoveItemCommand::class));
    }

    public function test_a_command_listed_twice_is_refused(): void
    {
        $this->expectException(CommandListedTwice::class);

        $this->registryOf([$this->shop([AddItemCommand::class, AddItemCommand::class])]);
    }

    public function test_core_reads_a_pair_in_its_commands_folder(): void
    {
        $registry = $this->registryOf([$this->layouts([FinalPlantCommand::class])]);

        $this->assertSame(FinalPlantHandler::class, $registry->handlerOf(FinalPlantCommand::class));
        $this->assertSame(CommandOwner::CORE, $registry->ownerOf(FinalPlantCommand::class));
    }

    public function test_a_core_pair_in_an_old_area_folder_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'Commands folder', [$this->layouts([PruneCommand::class])]);
    }

    public function test_a_command_outside_its_commands_folder_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'Commands folder', [$this->shop([MisplacedItem::class])]);
    }

    public function test_a_command_that_is_not_final_readonly_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'final readonly', [$this->shop([LooseItemCommand::class])]);
    }

    public function test_a_readonly_command_that_is_not_final_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'final readonly', [$this->shop([OpenItemCommand::class])]);
    }

    public function test_a_command_that_does_not_extend_the_base_command_is_refused(): void
    {
        $this->refusedWith(
            CommandDeclarationInvalid::class,
            'extends App\\Support\\Command',
            [$this->shop([BaselessItemCommand::class])],
        );
    }

    public function test_a_queued_command_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'queueing', [$this->shop([QueuedItemCommand::class])]);
    }

    public function test_a_property_outside_the_grammar_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'callback', [$this->shop([ClosureItemCommand::class])]);
    }

    public function test_a_command_without_a_handler_is_refused(): void
    {
        $this->expectException(CommandHandlerMissing::class);

        $this->registryOf([$this->shop([NoHandlerItemCommand::class])]);
    }

    public function test_a_result_outside_the_grammar_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'its result', [$this->shop([ArrayResultItemCommand::class])]);
    }

    public function test_a_handler_kept_between_commands_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'built fresh', [$this->shop([SingletonItemCommand::class])]);
    }

    public function test_a_middleware_that_is_no_command_middleware_is_refused(): void
    {
        $this->refusedWith(MiddlewareDeclarationInvalid::class, 'CommandMiddleware', [
            $this->shop([], [MiddlewareDeclaration::around(NotMiddleware::class, CommandScope::all())]),
        ]);
    }

    public function test_a_middleware_declared_twice_for_the_same_commands_is_refused(): void
    {
        $this->expectException(MiddlewareListedTwice::class);

        $this->registryOf([$this->shop([], [
            MiddlewareDeclaration::around(LogShop::class, CommandScope::all()),
            MiddlewareDeclaration::inside(LogShop::class, CommandScope::all()),
        ])]);
    }

    public function test_a_middleware_naming_another_owners_private_command_is_refused(): void
    {
        $this->refusedWith(MiddlewareDeclarationInvalid::class, 'may not name', [
            $this->shop([AddItemCommand::class]),
            $this->garden([], [MiddlewareDeclaration::around(Fence::class, CommandScope::command(AddItemCommand::class))]),
        ]);
    }

    public function test_a_domain_scopes_middleware_to_an_exported_core_command_without_requiring_core(): void
    {
        $registry = $this->registryOf([
            CoreCommands::owner(),
            $this->garden([], [MiddlewareDeclaration::around(Fence::class, CommandScope::command(RetireAgentCommand::class))]),
        ]);

        $this->assertContains(Fence::class, $this->middlewareClassesOf($registry, RetireAgentCommand::class));
    }

    public function test_each_ruled_property_keeps_its_laravel_rules_with_the_type_rule_first(): void
    {
        $registry = $this->registryOf([$this->shop([LimitedItemCommand::class, RemoveItemCommand::class])]);

        $this->assertSame([
            'label' => ['string', 'max:5'],
            'count' => ['integer', 'between:1,10'],
            'tags' => ['array', 'max:3'],
        ], $registry->rulesFor(LimitedItemCommand::class));
        $this->assertSame([], $registry->rulesFor(RemoveItemCommand::class));
    }

    public function test_a_limit_on_an_enum_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'size is the enum', [
            $this->shop([EnumLimitedItemCommand::class]),
        ]);
    }

    public function test_a_rule_that_reads_the_database_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'itemId uses Exists, which reads the database', [
            $this->shop([LookupItemCommand::class]),
        ]);
    }

    public function test_a_rule_that_reads_the_database_is_refused_before_it_is_built(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'itemId uses Exists, which reads the database', [
            $this->shop([UnbuildableLookupItemCommand::class]),
        ]);
    }

    public function test_a_rule_naming_a_field_the_command_lacks_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'title names the field breif', [
            $this->shop([MisnamedFieldItemCommand::class]),
        ]);
    }

    public function test_a_limit_inside_a_carried_value_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'whose property text has a validation attribute', [
            $this->shop([ValueRuledItemCommand::class]),
        ]);
    }

    public function test_a_list_typed_on_a_contract_is_accepted(): void
    {
        $registry = $this->registryOf([$this->shop([PartsItemCommand::class])]);

        $this->assertSame([], $registry->rulesFor(PartsItemCommand::class));
    }

    public function test_a_carried_value_with_a_property_that_can_change_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'final readonly', [
            $this->shop([MutableLabeledItemCommand::class]),
        ]);
    }

    public function test_an_attribute_no_rule_can_be_made_of_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'count has a validation attribute that cannot be', [
            $this->shop([UnreadableRuleItemCommand::class]),
        ]);
    }

    /**
     * @param  class-string<\Throwable>  $exception
     * @param  list<CommandOwner>  $owners
     */
    private function refusedWith(string $exception, string $reason, array $owners): void
    {
        $this->expectException($exception);
        $this->expectExceptionMessage($reason);

        $this->registryOf($owners);
    }

    /**
     * @param  list<CommandOwner>  $owners
     */
    private function registryOf(array $owners): CommandRegistry
    {
        $catalogue = $this->app->make(PolicyCatalogue::class);
        $registered = array_map(fn (PolicyDefinition $definition) => $definition->policy, $catalogue->definitions());

        if (! in_array(FixturePolicy::class, $registered, true)) {
            $catalogue->register('Shop', new PolicyDefinition(FixturePolicy::class, [
                AccessType::Read,
                AccessType::Create,
                AccessType::Edit,
                AccessType::Delete,
            ]));
        }

        return CommandRegistry::from($owners, $this->app->make(PipelineRunner::class));
    }

    /**
     * @return list<class-string>
     */
    private function middlewareClassesOf(CommandRegistry $registry, string $command): array
    {
        return array_map(
            fn (RegisteredMiddleware $entry) => $entry->declaration->middleware,
            $registry->middlewareFor($command),
        );
    }

    /**
     * @param  list<class-string>  $commands
     * @param  list<MiddlewareDeclaration>  $middleware
     * @param  list<class-string>  $exports  the commands it exports
     */
    /**
     * A Core-named owner over the layout fixture, whose pairs sit in its final Commands folder or in an area's.
     *
     * @param  list<class-string>  $commands
     */
    private function layouts(array $commands): CommandOwner
    {
        return new CommandOwner(
            CommandOwner::CORE,
            'Tests\\Fixtures\\Bus\\Layouts',
            CommandOwner::CORE,
            $commands,
            [],
            [],
            Exports::make()->build(),
        );
    }

    private function shop(array $commands, array $middleware = [], array $exports = []): CommandOwner
    {
        return new CommandOwner(
            'Shop',
            'Tests\\Fixtures\\Bus\\Shop',
            'Tests\\Fixtures\\Bus\\Shop\\ShopDomain',
            $commands,
            $middleware,
            [],
            Exports::make()->commands(...$exports)->build(),
        );
    }

    /**
     * @param  list<class-string>  $commands
     * @param  list<MiddlewareDeclaration>  $middleware
     */
    private function garden(array $commands, array $middleware = []): CommandOwner
    {
        return new CommandOwner(
            'Garden',
            'Tests\\Fixtures\\Bus\\Garden',
            'Tests\\Fixtures\\Bus\\Garden\\GardenDomain',
            $commands,
            $middleware,
            ['Shop'],
            Exports::make()->build(),
        );
    }
}
