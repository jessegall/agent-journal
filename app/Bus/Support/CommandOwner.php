<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Exports\Support\Exports;

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
     * @param  string  $namespace  the owner's namespace, whose Commands and CommandMiddleware folders hold
     *                             its parts
     * @param  string  $domainClass  the owner's Domain class, or CORE, as a middleware scope names it
     * @param  list<class-string>  $commands
     * @param  list<MiddlewareDeclaration>  $middleware
     * @param  list<string>  $requires  the names of the owners it requires
     */
    public function __construct(
        public string $name,
        public string $namespace,
        public string $domainClass,
        public array $commands,
        public array $middleware,
        public array $requires,
        public Exports $exports,
    ) {}

    public function exportsClass(string $class): bool
    {
        return $this->exports->has($class);
    }

    public function exportsCommand(string $class): bool
    {
        return $this->exports->hasCommand($class);
    }

    /**
     * Whether a class sits in this owner's folder of that kind, such as its Commands or CommandMiddleware folder; for Core, in
     * that folder of one of its areas.
     */
    public function holdsIn(string $folder, string $class): bool
    {
        // Core's pairs sit in App\Commands, or, until plan 62 phase 4 moves the last area, in an area's own folder
        // such as App\Assignments\Commands; remove the area form with the last area.
        if ($this->name === self::CORE && preg_match(
            '/^'.preg_quote($this->namespace, '/').'\\\\\w+\\\\'.preg_quote($folder, '/').'\\\\/',
            $class,
        ) === 1) {
            return true;
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
