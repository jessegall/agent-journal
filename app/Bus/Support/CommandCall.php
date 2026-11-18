<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\Command;
use App\Bus\Exceptions\CommandReplacedWithOtherClass;

/**
 * One command on its way through the bus: the command as it is now, the command as the caller passed it, its owner,
 * whether it is exported, whether it needs repeatable read, and the actor running it, read once at dispatch.
 */
final readonly class CommandCall
{
    /**
     * @param  Command<mixed>  $command
     * @param  Command<mixed>  $original
     */
    private function __construct(
        public Command $command,
        public Command $original,
        public string $owner,
        public bool $exported,
        public bool $repeatableRead,
        public ActorContext|null $actor,
    ) {}

    /**
     * @param  Command<mixed>  $command
     */
    public static function of(Command $command, string $owner, bool $exported, bool $repeatableRead, ActorContext|null $actor): self
    {
        return new self($command, $command, $owner, $exported, $repeatableRead, $actor);
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
        return $this->exported;
    }

    public function needsRepeatableRead(): bool
    {
        return $this->repeatableRead;
    }

    /**
     * The actor the command runs for.
     *
     * @throws ActorContextMissing for a command run with no actor
     */
    public function actor(): ActorContext
    {
        return $this->actor ?? throw ActorContextMissing::forRequest();
    }

    /**
     * The actor as a log line writes it, such as user:1, or null without an actor.
     */
    public function actorText(): string|null
    {
        return $this->actor === null ? null : $this->actor->type->value.':'.$this->actor->id;
    }

    /**
     * The same call carrying a changed copy of the command; the original stays as the caller passed it.
     */
    public function replacedBy(object $command): self
    {
        if (! $command instanceof Command || $command::class !== $this->command::class) {
            throw CommandReplacedWithOtherClass::for($this->name(), $command::class);
        }

        return new self($command, $this->original, $this->owner, $this->exported, $this->repeatableRead, $this->actor);
    }
}
