<?php

declare(strict_types=1);

namespace App\Bus;

use App\Bus\Attributes\Console\JournalRoute;
use App\Support\Reflector;
use Illuminate\Console\Command;

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
     * @param  array<string, \Symfony\Component\Console\Command\Command>  $commands  the registered console commands by
     *                                                                               name
     */
    public static function fromCommands(array $commands): self
    {
        $routes = [];

        foreach ($commands as $name => $command) {
            if (! $command instanceof Command) {
                continue;
            }

            $declaration = Reflector::of($command);

            if ($declaration->hasAttribute(JournalRoute::class)) {
                $routes[$name] = $declaration->attribute(JournalRoute::class);
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
        if (isset($this->routes[$name])) {
            return [$this->routes[$name]];
        }

        return [];
    }

    /**
     * @return list<string>
     */
    public function names(): array
    {
        return array_keys($this->routes);
    }
}
