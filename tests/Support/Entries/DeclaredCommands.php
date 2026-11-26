<?php

declare(strict_types=1);

namespace Tests\Support\Entries;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\Command;
use App\CommandRules\Mcp\Tools\JournalTool;
use App\Reflection\Attributes;
use App\Support\Reflector;
use Illuminate\Container\Container;
use Illuminate\Routing\Route;
use Illuminate\Routing\Router;
use Illuminate\Support\Str;

/**
 * The commands an entry point declares it sends with #[Dispatches]: on a route's action method, or on a tool's class.
 */
final readonly class DeclaredCommands
{
    /**
     * @return list<class-string<Command<mixed>>>
     */
    public static function ofRoute(Route $route): array
    {
        $controller = (string) $route->getControllerClass();
        // Laravel names an invokable controller's action by the controller itself.
        $action = $route->getActionMethod() === $controller ? '__invoke' : $route->getActionMethod();

        $declared = self::commandsOf(Reflector::of($controller)->method($action)->attributes(Dispatches::class));

        return [...$declared, ...self::ofMiddleware($route)];
    }

    /**
     * The commands the route's middleware declares it sends itself, such as a host call's recorded answer.
     *
     * @return list<class-string<Command<mixed>>>
     */
    private static function ofMiddleware(Route $route): array
    {
        $commands = [];

        foreach (Container::getInstance()->make(Router::class)->gatherRouteMiddleware($route) as $middleware) {
            $class = Str::before((string) $middleware, ':');

            if (Reflector::exists($class)) {
                $commands = [...$commands, ...self::commandsOf(Reflector::of($class)->attributes(Dispatches::class))];
            }
        }

        return $commands;
    }

    /**
     * @param  class-string<JournalTool>  $tool
     * @return list<class-string<Command<mixed>>>
     */
    public static function ofTool(string $tool): array
    {
        return self::commandsOf(Reflector::of($tool)->attributes(Dispatches::class));
    }

    /**
     * @param  Attributes<Dispatches>  $attributes
     * @return list<class-string<Command<mixed>>>
     */
    private static function commandsOf(Attributes $attributes): array
    {
        return array_map(fn (Dispatches $dispatches) => $dispatches->command, iterator_to_array($attributes, false));
    }
}
