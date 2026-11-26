<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\Command;
use App\Exceptions\ActorContextMissing;
use App\Exceptions\CommandReplacedWithOtherClass;

/**
 * One command on its way through the bus: the command as it is now, the command as the caller passed it, its owner,
 * whether it is exported, whether it needs repeatable read, and the actor running it, read once at dispatch.
 */
final readonly class CommandCall
{
    /**
     * @param  Command<mixed>  $command
     * @param  Command<mixed>  $original
     * @param  list<array{Command<mixed>, object|string}>  $authorized  the command and the subject it was authorized on
     * @param  list<class-string>  $trail  the middleware the call passed, in order
     */
    private function __construct(
        public Command $command,
        public Command $original,
        public string $owner,
        public bool $isExported,
        public bool $isRepeatableRead,
        public ActorReference|null $actor,
        public array $authorized = [],
        public array $trail = [],
    ) {}

    /**
     * @param  Command<mixed>  $command
     */
    public static function of(
        Command $command,
        string $owner,
        bool $isExported,
        bool $isRepeatableRead,
        ActorReference|null $actor,
    ): self {
        return new self($command, $command, $owner, $isExported, $isRepeatableRead, $actor);
    }

    /**
     * @return Command<mixed>
     */
    public function command(): Command
    {
        return $this->command;
    }

    /**
     * @return Command<mixed>
     */
    public function original(): Command
    {
        return $this->original;
    }

    /**
     * @return class-string<Command<mixed>>
     */
    public function name(): string
    {
        return $this->command::class;
    }

    public function owner(): string
    {
        return $this->owner;
    }

    public function isExported(): bool
    {
        return $this->isExported;
    }

    public function isRepeatableReadNeeded(): bool
    {
        return $this->isRepeatableRead;
    }

    /**
     * The actor the command runs for.
     *
     * @throws ActorContextMissing for a command run with no actor
     */
    public function actor(): ActorReference
    {
        return $this->actor ?? throw ActorContextMissing::forRequest();
    }

    /**
     * The actor as a log line writes it, such as user:1, or null without an actor.
     */
    public function actorText(): string|null
    {
        if ($this->actor === null) {
            return null;
        }

        return $this->actor->text();
    }

    /**
     * The middleware the call passed so far, in the order it passed them.
     *
     * @return list<class-string>
     */
    public function trail(): array
    {
        return $this->trail;
    }

    /**
     * The same call, having passed the middleware too.
     *
     * @param  class-string  $middleware
     */
    public function passedThrough(string $middleware): self
    {
        return clone ($this, ['trail' => [...$this->trail, $middleware]]);
    }

    /**
     * The same call bound to the given dispatcher, its command a copy carrying it; the original stays unbound.
     */
    public function withDispatcher(ActorReference $dispatcher): self
    {
        return clone ($this, [
            'command' => $this->command->withDispatcher($dispatcher),
            'actor' => $dispatcher,
            'authorized' => [],
        ]);
    }

    /**
     * The same call carrying a changed copy of the command, bound to the call's actor; the original stays as the
     * caller passed it.
     */
    public function replacedBy(object $command): self
    {
        if (! $command instanceof Command || $command::class !== $this->command::class) {
            throw CommandReplacedWithOtherClass::for($this->name(), $command::class);
        }

        return new self(
            $command->withDispatcher($this->actor()),
            $this->original,
            $this->owner,
            $this->isExported,
            $this->isRepeatableRead,
            $this->actor,
            trail: $this->trail,
        );
    }

    /**
     * The same call with the subject its command was authorized on in this attempt.
     */
    public function authorizedOn(object|string $subject): self
    {
        $authorized = [$this->command, $subject];

        $repeatableRead = $this->isRepeatableRead;

        return new self(
            $this->command,
            $this->original,
            $this->owner,
            $this->isExported,
            $repeatableRead,
            $this->actor,
            [$authorized],
            $this->trail,
        );
    }

    /**
     * The subject the call's current command was authorized on; none when it was not, or when a middleware replaced
     * the command after it was.
     *
     * @return list<object|string>
     */
    public function authorizedSubject(): array
    {
        $authorized = $this->authorized[0] ?? null;

        if ($authorized !== null && $authorized[0] === $this->command) {
            return [$authorized[1]];
        }

        return [];
    }
}
