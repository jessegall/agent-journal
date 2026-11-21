<?php

declare(strict_types=1);

namespace App\Bus\Support;

/**
 * What the registry's checks have read so far of every owner's declarations: the owners in order, each command with
 * its handler and the checked middleware. Each pipe of the registry's pipeline adds its part.
 */
final readonly class CommandDeclarations
{
    /**
     * @param  list<CommandOwner>  $owners  Core first, then the domains in bootstrap/domains.php order
     * @param  list<DeclaredCommand>  $commands
     * @param  list<RegisteredMiddleware>  $middleware
     */
    public function __construct(
        public array $owners,
        public array $commands = [],
        public array $middleware = [],
    ) {}

    /**
     * @param  list<DeclaredCommand>  $commands
     */
    public function withCommands(array $commands): self
    {
        return new self($this->owners, $commands, $this->middleware);
    }

    /**
     * @param  list<RegisteredMiddleware>  $middleware
     */
    public function withMiddleware(array $middleware): self
    {
        return new self($this->owners, $this->commands, $middleware);
    }

    /**
     * Each command's owner by its class name.
     *
     * @return array<string, CommandOwner>
     */
    public function commandOwners(): array
    {
        $owners = [];

        foreach ($this->commands as $declared) {
            $owners[$declared->command] = $declared->owner;
        }

        return $owners;
    }

    /**
     * The grammar an owner's commands are checked against: a property type may name the owner's own classes and the
     * classes exported by Core and by the owners it requires.
     */
    public function grammarFor(CommandOwner $owner): CommandGrammar
    {
        $owners = $this->owners;

        $exportsTo = static fn (CommandOwner $other, string $class): bool => $other->exportsClass($class)
            && ($other->name === CommandOwner::CORE || $owner->requiresOwner($other->name));

        return new CommandGrammar(static fn (string $class): bool => str_starts_with($class, $owner->namespace.'\\')
            || array_filter($owners, static fn (CommandOwner $other): bool => $exportsTo($other, $class)) !== []);
    }
}
