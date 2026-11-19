<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandNotRegistered;
use Illuminate\Bus\Dispatcher;
use Illuminate\Contracts\Container\Container;

/**
 * The command bus of one request: a Laravel dispatcher of its own, built with this request's container, mapped to
 * the registered handlers and piped only through MiddlewareRunner. A handler is built only when its command reaches it. The shared dispatcher keeps the container it was
 * booted with under Octane, so commands never go through it.
 */
final readonly class LaravelCommandBus implements CommandBus
{
    private function __construct(
        private Dispatcher $dispatcher,
        private CommandRegistry $registry,
        private Container $container,
    ) {}

    /**
     * The bus of one request: its own dispatcher with that request's container, mapped and piped.
     */
    public static function forRequest(Container $container, CommandRegistry $registry): self
    {
        $dispatcher = new Dispatcher($container);
        $dispatcher->map($registry->handlerMap());
        $dispatcher->pipeThrough([$container->make(MiddlewareRunner::class)]);

        return new self($dispatcher, $registry, $container);
    }

    public function run(Command $command): mixed
    {
        if (! $this->registry->has($command::class)) {
            throw CommandNotRegistered::for($command::class);
        }

        return $this->dispatcher->dispatchSync(
            $command,
            new DeferredCommandHandler($this->container, $this->registry->handlerOf($command::class)),
        );
    }

    /**
     * Whether this bus's dispatcher has a handler for the command, as Laravel itself answers it.
     *
     * @param  Command<mixed>  $command
     */
    public function hasHandlerFor(Command $command): bool
    {
        return $this->dispatcher->hasCommandHandler($command);
    }
}
