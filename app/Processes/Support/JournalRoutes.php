<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Attributes\JournalRoute;
use Illuminate\Console\Command;
use ReflectionClass;

/**
 * The journal command routes agents may run, by their name (task:assigned), each with what it does; built once from the
 * console commands that carry a JournalRoute attribute.
 */
final readonly class JournalRoutes
{
    /**
     * @param  array<string, JournalRoute>  $routes
     */
    private function __construct(private array $routes) {}

    /**
     * @param  array<string, \Symfony\Component\Console\Command\Command>  $commands  the registered console commands by name
     */
    public static function fromCommands(array $commands): self
    {
        $routes = [];
        foreach ($commands as $name => $command) {
            $attributes = $command instanceof Command ? new ReflectionClass($command)->getAttributes(
                JournalRoute::class,
            ) : [];
            if ($attributes !== []) {
                $routes[$name] = $attributes[0]->newInstance();
            }
        }
        ksort($routes);

        return new self($routes);
    }

    /**
     * The route of a subject and verb, or none when no command declares it.
     *
     * @return list<JournalRoute>
     */
    public function routeOf(string $name): array
    {
        return isset($this->routes[$name]) ? [$this->routes[$name]] : [];
    }

    /**
     * @return list<string>
     */
    public function names(): array
    {
        return array_keys($this->routes);
    }
}
