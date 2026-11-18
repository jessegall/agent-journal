<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Actors\Enums\ActorType;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Exceptions\CommandHandlerMissing;
use App\Bus\Exceptions\CommandListedTwice;
use App\Bus\Exceptions\HandlerInOtherOwner;
use App\Bus\Exceptions\HandlerServesTwoCommands;
use App\Bus\Exceptions\MiddlewareDeclarationInvalid;
use App\Bus\Exceptions\MiddlewareListedTwice;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Bus\Support\RegisteredMiddleware;
use App\CoreCommands;
use App\Domains\Support\DomainRegistry;
use App\Exports\Support\Exports;
use Tests\Fixtures\Bus\Garden\CommandMiddleware\Fence;
use Tests\Fixtures\Bus\Garden\Commands\Water;
use Tests\Fixtures\Bus\Garden\Handlers\WaterHandler;
use Tests\Fixtures\Bus\Shop\CommandMiddleware\CheckStock;
use Tests\Fixtures\Bus\Shop\CommandMiddleware\LogShop;
use Tests\Fixtures\Bus\Shop\CommandMiddleware\NotMiddleware;
use Tests\Fixtures\Bus\Shop\Commands\AddItem;
use Tests\Fixtures\Bus\Shop\Commands\ArrayResultItem;
use Tests\Fixtures\Bus\Shop\Commands\ClosureItem;
use Tests\Fixtures\Bus\Shop\Commands\LooseItem;
use Tests\Fixtures\Bus\Shop\Commands\NoHandlerItem;
use Tests\Fixtures\Bus\Shop\Commands\QueuedItem;
use Tests\Fixtures\Bus\Shop\Commands\RemoveItem;
use Tests\Fixtures\Bus\Shop\Commands\SingletonItem;
use Tests\Fixtures\Bus\Shop\Commands\StolenItem;
use Tests\Fixtures\Bus\Shop\Commands\TwinItem;
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
        $registry = CommandRegistry::from([
            $this->shop([AddItem::class, RemoveItem::class], [
                MiddlewareDeclaration::inside(CheckStock::class, CommandScope::command(AddItem::class)),
                MiddlewareDeclaration::around(LogShop::class, CommandScope::all()),
            ], exports: [AddItem::class]),
            $this->garden([Water::class], [MiddlewareDeclaration::around(Fence::class, CommandScope::all())]),
        ]);

        $this->assertSame([AddItem::class => AddItemHandler::class, RemoveItem::class => RemoveItemHandler::class, Water::class => WaterHandler::class], $registry->handlerMap());
        $this->assertSame('Shop', $registry->ownerOf(AddItem::class));
        $this->assertTrue($registry->isExported(AddItem::class));
        $this->assertFalse($registry->isExported(RemoveItem::class));
        $this->assertTrue($registry->needsRepeatableRead(AddItem::class));
        $this->assertSame(ActorType::User, $registry->requiredActor(AddItem::class));
        $this->assertNull($registry->requiredActor(RemoveItem::class));
        $this->assertSame([LogShop::class, Fence::class, CheckStock::class], array_map(fn (RegisteredMiddleware $entry) => $entry->declaration->middleware, $registry->middlewareFor(AddItem::class)));
    }

    public function test_the_application_starts_with_the_real_owners(): void
    {
        $this->assertFalse($this->app->make(DomainRegistry::class)->commandDeclarations(CoreCommands::owner())->has(AddItem::class));
    }

    public function test_a_command_exported_but_not_registered_by_its_owner_is_refused(): void
    {
        $this->expectExceptionObject(CommandDeclarationInvalid::exportedButNotRegistered('Shop', RemoveItem::class));

        CommandRegistry::from([$this->shop([AddItem::class], exports: [RemoveItem::class])]);
    }

    public function test_a_registered_command_that_is_not_exported_stays_private(): void
    {
        $registry = CommandRegistry::from([$this->shop([AddItem::class, RemoveItem::class], exports: [AddItem::class])]);

        $this->assertTrue($registry->isExported(AddItem::class));
        $this->assertFalse($registry->isExported(RemoveItem::class));
    }

    public function test_a_command_listed_twice_is_refused(): void
    {
        $this->expectException(CommandListedTwice::class);

        CommandRegistry::from([$this->shop([AddItem::class, AddItem::class])]);
    }

    public function test_a_command_outside_its_commands_folder_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'Commands folder', [$this->shop([MisplacedItem::class])]);
    }

    public function test_a_command_that_is_not_final_readonly_is_refused(): void
    {
        $this->refusedWith(CommandDeclarationInvalid::class, 'final readonly', [$this->shop([LooseItem::class])]);
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

        CommandRegistry::from([$this->shop([NoHandlerItem::class])]);
    }

    public function test_a_handler_of_another_owner_is_refused(): void
    {
        $this->expectException(HandlerInOtherOwner::class);

        CommandRegistry::from([$this->shop([StolenItem::class]), $this->garden([])]);
    }

    public function test_a_handler_serving_two_commands_is_refused(): void
    {
        $this->expectException(HandlerServesTwoCommands::class);

        CommandRegistry::from([$this->shop([AddItem::class, TwinItem::class])]);
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
        $this->refusedWith(MiddlewareDeclarationInvalid::class, 'CommandMiddleware', [$this->shop([], [MiddlewareDeclaration::around(NotMiddleware::class, CommandScope::all())])]);
    }

    public function test_a_middleware_declared_twice_for_the_same_commands_is_refused(): void
    {
        $this->expectException(MiddlewareListedTwice::class);

        CommandRegistry::from([$this->shop([], [MiddlewareDeclaration::around(LogShop::class, CommandScope::all()), MiddlewareDeclaration::inside(LogShop::class, CommandScope::all())])]);
    }

    public function test_a_middleware_naming_another_owners_private_command_is_refused(): void
    {
        $this->refusedWith(MiddlewareDeclarationInvalid::class, 'may not name', [
            $this->shop([AddItem::class]),
            $this->garden([], [MiddlewareDeclaration::around(Fence::class, CommandScope::command(AddItem::class))]),
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

        CommandRegistry::from($owners);
    }

    /**
     * @param  list<class-string>  $commands
     * @param  list<MiddlewareDeclaration>  $middleware
     * @param  list<class-string>  $exports  the commands it exports
     */
    private function shop(array $commands, array $middleware = [], array $exports = []): CommandOwner
    {
        return new CommandOwner('Shop', 'Tests\\Fixtures\\Bus\\Shop', 'Tests\\Fixtures\\Bus\\Shop\\ShopDomain', $commands, $middleware, [], Exports::make()->commands(...$exports)->build());
    }

    /**
     * @param  list<class-string>  $commands
     * @param  list<MiddlewareDeclaration>  $middleware
     */
    private function garden(array $commands, array $middleware = []): CommandOwner
    {
        return new CommandOwner('Garden', 'Tests\\Fixtures\\Bus\\Garden', 'Tests\\Fixtures\\Bus\\Garden\\GardenDomain', $commands, $middleware, ['Shop'], Exports::make()->build());
    }
}
