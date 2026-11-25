<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandEnd;
use App\Enums\Engine\MiddlewareStage;
use App\Support\CommandFrame;
use App\Support\CommandRegistry;
use App\Support\LaravelCommandBus;
use App\Support\RegisteredMiddleware;
use PHPUnit\Framework\Assert;
use Tests\Support\Bus\CommandSink;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\Bus\SunkCommand;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * Commands that end in the test sink instead of their handlers: what a route, tool or state sent, in order, with the
 * middleware each passed, so a test of an entry point proves what it sent without running what the command does.
 */
trait SinksCommands
{
    private CommandSink|null $sink = null;

    /**
     * Ends every command of this application in the sink from now on, until the application is made again.
     */
    public function sinkCommands(): self
    {
        $this->sink = $this->app->make(CommandSink::class);
        $this->app->instance(CommandEnd::class, $this->sink);
        // The request's bus holds the end it was built with, so it is built again with the sink.
        $this->app->forgetInstance(LaravelCommandBus::class);

        return $this;
    }

    /**
     * The reply the sink gives each command of the class, a value of the command's own result type.
     *
     * @param  class-string<Command<mixed>>  $command
     */
    public function sinkReply(string $command, mixed $reply): self
    {
        $this->sinkInPlace()->reply($command, $reply);

        return $this;
    }

    /**
     * The reply the sink gives each command of these classes.
     *
     * @param  array<class-string<Command<mixed>>, mixed>  $replies
     */
    public function sinkReplies(array $replies): self
    {
        foreach ($replies as $command => $reply) {
            $this->sinkReply($command, $reply);
        }

        return $this;
    }

    /**
     * @return list<SunkCommand>
     */
    public function dispatched(): array
    {
        return $this->sinkInPlace()->sunk();
    }

    /**
     * So many commands of the class were sunk, each with every named public property holding exactly its value.
     *
     * @param  class-string<Command<mixed>>  $command
     * @param  array<string, mixed>  $arguments
     */
    public function assertDispatched(string $command, array $arguments = [], int $times = 1): self
    {
        $sunk = array_filter($this->dispatched(), fn (SunkCommand $sunk) => $sunk->name() === $command);
        Assert::assertCount($times, $sunk, "A different number of {$command} was sent.");

        foreach ($sunk as $one) {
            Assert::assertTrue($one->matches($command, $arguments), "{$command} was sent with other arguments.");
        }

        return $this;
    }

    /**
     * The sunk commands are exactly these, class and arguments, in this order.
     *
     * @param  list<ExpectedCommand>  $expected
     */
    public function assertDispatchedInOrder(array $expected): self
    {
        $sunk = $this->dispatched();
        Assert::assertSame(
            array_map(fn (ExpectedCommand $command) => $command->command, $expected),
            array_map(fn (SunkCommand $command) => $command->name(), $sunk),
            'Other commands were sent, or in another order.',
        );

        foreach ($expected as $position => $command) {
            Assert::assertTrue(
                $sunk[$position]->matches($command->command, $command->arguments),
                "{$command->command} was sent with other arguments.",
            );
        }

        return $this;
    }

    /**
     * Each sunk command of the class passed the whole frame: Core's first steps, its module middleware before the
     * transaction, the transaction, Core's inside steps and its module middleware inside.
     *
     * @param  class-string<Command<mixed>>  $command
     */
    public function assertPassedEveryMiddleware(string $command): self
    {
        $expected = [
            ...CommandFrame::FIRST,
            ...$this->moduleMiddlewareOf($command, MiddlewareStage::BeforeTransaction),
            CommandFrame::TRANSACTION,
            ...CommandFrame::INSIDE,
            ...$this->moduleMiddlewareOf($command, MiddlewareStage::InsideTransaction),
        ];

        foreach ($this->dispatched() as $sunk) {
            if ($sunk->name() === $command) {
                Assert::assertSame($expected, $sunk->trail, "{$command} skipped middleware of its frame.");
            }
        }

        return $this;
    }

    /**
     * The sunk commands are exactly the expected ones, in order, each through every middleware of its frame; with none
     * expected, nothing was sent.
     *
     * @param  list<ExpectedCommand>  $expected
     */
    public function assertDispatchedExactly(array $expected): self
    {
        $this->assertDispatchedInOrder($expected);

        foreach (array_unique(array_map(fn (SunkCommand $sunk) => $sunk->name(), $this->dispatched())) as $name) {
            $this->assertPassedEveryMiddleware($name);
        }

        return $this;
    }

    /**
     * Every sunk command is one the sender declares with #[Dispatches].
     *
     * @param  list<class-string<Command<mixed>>>  $declared
     */
    public function assertDispatchedOnlyDeclared(array $declared, string $sender): self
    {
        foreach ($this->dispatched() as $sunk) {
            Assert::assertContains(
$sunk->name(),
 $declared,
 "{$sender} sent {$sunk->name()}: declare it with #[Dispatches].",
);
        }

        return $this;
    }

    public function assertNothingDispatched(): self
    {
        Assert::assertSame([], $this->dispatched(), 'A command was sent.');

        return $this;
    }

    private function sinkInPlace(): CommandSink
    {
        return $this->sink ?? throw FixtureRefused::noSink();
    }

    /**
     * The module middleware the registry runs on the command in the stage, in its order.
     *
     * @return list<string>
     */
    private function moduleMiddlewareOf(string $command, MiddlewareStage $stage): array
    {
        $entries = array_filter(
            $this->app->make(CommandRegistry::class)->middlewareFor($command),
            fn (RegisteredMiddleware $entry) => $entry->runsIn($stage),
        );

        return array_values(array_map(fn (RegisteredMiddleware $entry) => $entry->middlewareClass(), $entries));
    }
}
