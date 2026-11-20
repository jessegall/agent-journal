<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Agents\Commands\RetireAgent;
use App\Bus\Enums\CommandEntry;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Exceptions\CommandHandlerMissing;
use App\Bus\Exceptions\CommandListedTwice;
use App\Bus\Exceptions\HandlerInOtherOwner;
use App\Bus\Exceptions\HandlerServesTwoCommands;
use App\Bus\Exceptions\MiddlewareDeclarationInvalid;
use App\Bus\Exceptions\MiddlewareListedTwice;
use App\Bus\Support\CommandAuthorization;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Bus\Support\RegisteredMiddleware;
use App\CoreCommands;
use App\Domains\Support\DomainRegistry;
use App\Exports\Support\Exports;
use App\Pipelines\Contracts\PipelineRunner;
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Garden\CommandMiddleware\Fence;
use Tests\Fixtures\Bus\Garden\Commands\Water;
use Tests\Fixtures\Bus\Garden\Handlers\WaterHandler;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\CommandMiddleware\CheckStock;
use Tests\Fixtures\Bus\Shop\CommandMiddleware\LogShop;
use Tests\Fixtures\Bus\Shop\CommandMiddleware\NotMiddleware;
use Tests\Fixtures\Bus\Shop\Commands\AddItem;
use Tests\Fixtures\Bus\Shop\Commands\ArrayResultItem;
use Tests\Fixtures\Bus\Shop\Commands\BaselessItem;
use Tests\Fixtures\Bus\Shop\Commands\ClosureItem;
use Tests\Fixtures\Bus\Shop\Commands\EnumLimitedItem;
use Tests\Fixtures\Bus\Shop\Commands\LimitedItem;
use Tests\Fixtures\Bus\Shop\Commands\LookupItem;
use Tests\Fixtures\Bus\Shop\Commands\LooseItem;
use Tests\Fixtures\Bus\Shop\Commands\MisnamedFieldItem;
use Tests\Fixtures\Bus\Shop\Commands\NoHandlerItem;
use Tests\Fixtures\Bus\Shop\Commands\OpenItem;
use Tests\Fixtures\Bus\Shop\Commands\QueuedItem;
use Tests\Fixtures\Bus\Shop\Commands\RemoveItem;
use Tests\Fixtures\Bus\Shop\Commands\SingletonItem;
use Tests\Fixtures\Bus\Shop\Commands\StolenItem;
use Tests\Fixtures\Bus\Shop\Commands\TwinItem;
use Tests\Fixtures\Bus\Shop\Commands\UnreadableRuleItem;
use Tests\Fixtures\Bus\Shop\Commands\ValueRuledItem;
use Tests\Fixtures\Bus\Shop\Handlers\AddItemHandler;
use Tests\Fixtures\Bus\Shop\Handlers\RemoveItemHandler;
use Tests\Fixtures\Bus\Shop\Loose\MisplacedItem;
use Tests\TestCase;

/**
 * Start-up checks every command, handler and middleware declaration and refuses the first wrong one by name; a
 * correct set gives each command its handler, owner, settings and ordered middleware (doc 19, Books B and F).
 */
final class CommandRegistryTest extends TestCase
{
    public function test_a_correct_command_gets_its_handler_owner_settings_and_ordered_middleware(): void
    {
        $registry = $this->registryOf([
            $this->shop([AddItem::class, RemoveItem::class], [
                MiddlewareDeclaration::inside(CheckStock::class, CommandScope::command(AddItem::class)),
                MiddlewareDeclaration::around(LogShop::class, CommandScope::all()),
            ], exports: [AddItem::class]),
            $this->garden([Water::class], [MiddlewareDeclaration::around(Fence::class, CommandScope::all())]),
        ]);

        $this->assertSame([
            AddItem::class => AddItemHandler::class,
            RemoveItem::class => RemoveItemHandler::class,
            Water::class => WaterHandler::class,
        ], $registry->handlerMap());
        $this->assertSame('Shop', $registry->ownerOf(AddItem::class));
        $this->assertTrue($registry->isExported(AddItem::class));
        $this->assertFalse($registry->isExported(RemoveItem::class));
        $this->assertTrue($registry->needsRepeatableRead(AddItem::class));
        $this->assertEquals(
            new CommandAuthorization(FixturePolicy::class, FixtureAbility::Work),
            $registry->authorizationOf(AddItem::class)->get(),
        );
        $this->assertSame(CommandEntry::Application, $registry->entryOf(AddItem::class));
        $this->assertSame(
            [LogShop::class, Fence::class, CheckStock::class],
            $this->middlewareClassesOf($registry, AddItem::class),
        );
    }

    public function test_the_application_starts_with_the_real_owners(): void
    {
        $registry = $this->app->make(DomainRegistry::class)
            ->commandDeclarations(CoreCommands::owner(), $this->app->make(PipelineRunner::class));

        $this->assertFalse($registry->has(AddItem::class));
    }

    public function test_a_command_exported_but_not_registered_by_its_owner_is_refused(): void
    {
        $this->expectExceptionObject(CommandDeclarationInvalid::exportedButNotRegistered('Shop', RemoveItem::class));

        $this->registryOf([$this->shop([AddItem::class], exports: [RemoveItem::class])]);
    }

    public function test_a_registered_command_that_is_not_exported_stays_private(): void
    {
        $registry = $this->registryOf([$this->shop([AddItem::class, RemoveItem::class], exports: [AddItem::class])]);

        $this->assertTrue($registry->isExported(AddItem::class));
        $this->assertFalse($registry->isExported(RemoveItem::class));
    }

    public function test_an_exported_application_command_needs_an_operation_declaration(): void
    {
        $this->expectException(CommandDeclarationInvalid::class);
        $this->expectExceptionMessage('an exported application command needs Operation');

        $this->registryOf([$this->shop([RemoveItem::class], exports: [RemoveItem::class])]);
    }

    public function test_a_command_listed_twice_is_refused(): void
    {
        $this->expectException(CommandListedTwice::class);

        $this->registryOf([$this->shop([AddItem::class, AddItem::class])]);
    }

    public function test_a_command_outside_its_commands_folder_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'Commands folder', [$this->shop([MisplacedItem::class])]);
    }

    public function test_a_command_that_is_not_final_readonly_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'final readonly', [$this->shop([LooseItem::class])]);
    }

    public function test_a_readonly_command_that_is_not_final_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'final readonly', [$this->shop([OpenItem::class])]);
    }

    public function test_a_command_that_does_not_extend_the_base_command_is_refused(): void
    {
        $this->refusedWith(
            CommandDeclarationInvalid::class,
            'extends App\\Bus\\Support\\Command',
            [$this->shop([BaselessItem::class])],
        );
    }

    public function test_a_queued_command_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'queueing', [$this->shop([QueuedItem::class])]);
    }

    public function test_a_property_outside_the_grammar_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'callback', [$this->shop([ClosureItem::class])]);
    }

    public function test_a_command_without_a_handler_is_refused(): void
    {
        $this->expectException(CommandHandlerMissing::class);

        $this->registryOf([$this->shop([NoHandlerItem::class])]);
    }

    public function test_a_handler_of_another_owner_is_refused(): void
    {
        $this->expectException(HandlerInOtherOwner::class);

        $this->registryOf([$this->shop([StolenItem::class]), $this->garden([])]);
    }

    public function test_a_handler_serving_two_commands_is_refused(): void
    {
        $this->expectException(HandlerServesTwoCommands::class);

        $this->registryOf([$this->shop([AddItem::class, TwinItem::class])]);
    }

    public function test_a_result_outside_the_grammar_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'its result', [$this->shop([ArrayResultItem::class])]);
    }

    public function test_a_handler_kept_between_commands_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'built fresh', [$this->shop([SingletonItem::class])]);
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
            $this->shop([AddItem::class]),
            $this->garden([], [MiddlewareDeclaration::around(Fence::class, CommandScope::command(AddItem::class))]),
        ]);
    }

    public function test_a_domain_scopes_middleware_to_an_exported_core_command_without_requiring_core(): void
    {
        $registry = $this->registryOf([
            CoreCommands::owner(),
            $this->garden([], [MiddlewareDeclaration::around(Fence::class, CommandScope::command(RetireAgent::class))]),
        ]);

        $this->assertContains(Fence::class, $this->middlewareClassesOf($registry, RetireAgent::class));
    }

    public function test_each_ruled_property_keeps_its_laravel_rules_with_the_type_rule_first(): void
    {
        $registry = $this->registryOf([$this->shop([LimitedItem::class, RemoveItem::class])]);

        $this->assertSame([
            'label' => ['string', 'max:5'],
            'count' => ['integer', 'between:1,10'],
            'tags' => ['array', 'max:3'],
        ], $registry->rulesFor(LimitedItem::class));
        $this->assertSame([], $registry->rulesFor(RemoveItem::class));
    }

    public function test_a_limit_on_an_enum_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'size is the enum', [
            $this->shop([EnumLimitedItem::class]),
        ]);
    }

    public function test_a_rule_that_reads_the_database_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'itemId uses Exists, which reads the database', [
            $this->shop([LookupItem::class]),
        ]);
    }

    public function test_a_rule_naming_a_field_the_command_lacks_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'title names the field breif', [
            $this->shop([MisnamedFieldItem::class]),
        ]);
    }

    public function test_a_limit_inside_a_carried_value_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'whose property text has a validation attribute', [
            $this->shop([ValueRuledItem::class]),
        ]);
    }

    public function test_an_attribute_no_rule_can_be_made_of_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'count has a validation attribute that cannot be', [
            $this->shop([UnreadableRuleItem::class]),
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
