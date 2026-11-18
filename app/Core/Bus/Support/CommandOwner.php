<?php

declare(strict_types=1);

namespace App\Core\Bus\Support;

/**
 * One owner of commands as the registry reads it: its name, its commands, the middleware it adds, the owners it
 * requires and the classes it exports. The domain foundation builds one per domain; Core is one more.
 */
final readonly class CommandOwner
{
    /**
     * The owner name of Core's own commands.
     */
    public const string CORE = 'Core';

    /**
     * @param  string  $namespace  the owner's namespace, whose Commands, Handlers and CommandMiddleware folders hold its parts
     * @param  string  $domainClass  the owner's Domain class, or CORE, as a middleware scope names it
     * @param  list<class-string>  $commands
     * @param  list<MiddlewareDeclaration>  $middleware
     * @param  list<string>  $requires  the names of the owners it requires
     * @param  list<string>  $exports  the fully written names it exports
     */
    public function __construct(
        public string $name,
        public string $namespace,
        public string $domainClass,
        public array $commands,
        public array $middleware,
        public array $requires,
        public array $exports,
    ) {}

    public function exportsClass(string $class): bool
    {
        return in_array(strtolower($class), array_map(strtolower(...), $this->exports), true);
    }

    /**
     * Whether a class sits in this owner's folder of that kind, such as its Commands or Handlers folder.
     */
    public function holdsIn(string $folder, string $class): bool
    {
        return str_starts_with($class, "{$this->namespace}\\{$folder}\\");
    }

    public function requiresOwner(string $name): bool
    {
        return in_array($name, $this->requires, true);
    }
}
