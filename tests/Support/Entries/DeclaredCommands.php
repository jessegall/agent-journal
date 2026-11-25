<?php

declare(strict_types=1);

namespace Tests\Support\Entries;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\Command;
use App\Mcp\Tools\JournalTool;
use App\Support\Attributes;
use App\Support\Reflector;
use Illuminate\Routing\Route;

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

        return self::commandsOf(Reflector::of($controller)->method($action)->attributes(Dispatches::class));
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
