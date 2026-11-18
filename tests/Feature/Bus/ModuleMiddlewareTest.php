<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\Exceptions\CommandReplacementRefused;
use App\Bus\Exceptions\CommandResultChanged;
use App\Bus\Exceptions\ContinuationCalledTwice;
use App\Bus\Exceptions\MiddlewareSkippedCommand;
use App\Bus\Exceptions\MiddlewareSwallowedFailure;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\CallsNextTwice;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\ChangesResult;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefusesAll;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\ReplacesCardsCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\SkipsCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\SwallowsFailure;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\UppercasesText;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;

/**
 * Module middleware on the Cards and Notes test modules (doc 19, Book E): the order by stage, owner and declaration,
 * a replacement the handler sees, a refusal that writes nothing, and every break of the middleware contract refused
 * by name.
 */
final class ModuleMiddlewareTest extends CommandBusTestCase
{
    public function test_module_middleware_runs_by_stage_then_owner_then_declaration(): void
    {
        $trail = $this->installCommandModules();
        $this->startUserRequestAs(1);

        $this->app->make(CommandBus::class)->run(new WriteNote('ordered'));

        $this->assertSame(['cards around all', 'notes around all', 'notes around write', 'notes inside'], $trail->steps);
    }

    public function test_a_replacement_reaches_the_handler_and_a_refusal_writes_nothing(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(UppercasesText::class, CommandScope::command(WriteNote::class)));
        $this->startUserRequestAs(1);

        $this->assertSame('LOUD', $this->rowText($this->app->make(CommandBus::class)->run(new WriteNote('loud'))));

        $this->installCommandModules(MiddlewareDeclaration::around(RefusesAll::class, CommandScope::all()));
        $this->startUserRequestAs(1);
        $this->expectException(CommandRefused::class);
        $this->app->make(CommandBus::class)->run(new WriteNote('refused'));
    }

    /**
     * @return iterable<string, array{class-string, class-string<\Throwable>}>
     */
    public static function misbehavingMiddleware(): iterable
    {
        yield 'skips the command' => [SkipsCommand::class, MiddlewareSkippedCommand::class];
        yield 'calls next twice' => [CallsNextTwice::class, ContinuationCalledTwice::class];
        yield 'changes the result' => [ChangesResult::class, CommandResultChanged::class];
    }

    /**
     * @param  class-string  $middleware
     * @param  class-string<\Throwable>  $refusal
     */
    #[DataProvider('misbehavingMiddleware')]
    public function test_a_middleware_that_breaks_its_contract_is_refused_by_name(string $middleware, string $refusal): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around($middleware, CommandScope::all()));
        $this->startUserRequestAs(1);

        $this->expectException($refusal);
        $this->expectExceptionMessage($middleware);

        $this->app->make(CommandBus::class)->run(new WriteNote('broken'));
    }

    public function test_a_middleware_that_swallows_a_failure_is_refused_and_keeps_the_failure(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::inside(SwallowsFailure::class, CommandScope::all()));
        $this->startUserRequestAs(1);

        try {
            $this->app->make(CommandBus::class)->run(new RefuseNote('swallowed'));
            $this->fail('The swallowed failure was let through.');
        } catch (MiddlewareSwallowedFailure $failure) {
            $this->assertInstanceOf(CommandRefused::class, $failure->getPrevious());
        }
    }

    public function test_a_middleware_may_not_replace_another_owners_private_command(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(ReplacesCardsCommand::class, CommandScope::all()));
        $this->startUserRequestAs(1);

        $this->expectException(CommandReplacementRefused::class);

        $this->app->make(CommandBus::class)->run(new ShuffleDeck('red'));
    }
}
