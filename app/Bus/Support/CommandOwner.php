<?php

declare(strict_types=1);

namespace App\Bus\Support;

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
     * Whether a class sits in this owner's folder of that kind, such as its Commands or Handlers folder; for Core, in
     * that folder of one of its areas.
     */
    public function holdsIn(string $folder, string $class): bool
    {
        if ($this->name === self::CORE) {
            // Core keeps each area's commands in that area, such as App\Assignments\Commands.
            return preg_match('/^'.preg_quote($this->namespace, '/').'\\\\\w+\\\\'.preg_quote($folder, '/').'\\\\/', $class) === 1;
        }

        return str_starts_with($class, "{$this->namespace}\\{$folder}\\");
    }

    /**
     * Whether this owner may use what the named owner exports: Core is required by every owner without declaring it.
     */
    public function requiresOwner(string $name): bool
    {
        return $name === self::CORE || in_array($name, $this->requires, true);
    }
}
