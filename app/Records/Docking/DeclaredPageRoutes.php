<?php

declare(strict_types=1);

namespace App\Records\Docking;

use App\Docking\Cards\DestinationArgument;
use App\Docking\Cards\DockDestination;
use App\Ui\Support\UiDeclarations;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use PhpOption\None;
use PhpOption\Option;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Turns an address a record card names into the declared page it serves, with its route arguments; an address that
 * serves no declared page, or none at all, opens nothing.
 */
final readonly class DeclaredPageRoutes
{
    public function __construct(private Router $router, private UiDeclarations $declarations) {}

    /**
     * @return Option<DockDestination>
     */
    public function destinationOf(string|null $address): Option
    {
        if ($address === null) {
            return None::create();
        }

        try {
            $route = $this->router->getRoutes()->match(Request::create($address));
        } catch (HttpException) {
            return None::create();
        }

        $arguments = array_map(
            fn (string $name) => new DestinationArgument($name, (string) $route->originalParameter($name)),
            $route->parameterNames(),
        );

        return $this->declarations->pageOrNone((string) $route->getName())->map(
            fn () => new DockDestination((string) $route->getName(), ...$arguments),
        );
    }
}
