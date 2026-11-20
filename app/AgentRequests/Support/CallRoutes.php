<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use App\AgentRequests\Contracts\CallRegistrar;
use App\AgentRequests\Exceptions\EndpointDeclarationInvalid;
use Illuminate\Routing\Route;
use Illuminate\Routing\Router;
use ReflectionMethod;
use ReflectionNamedType;

/**
 * Registers a signed route from its call's declaration: the controller's __invoke takes the call, whose #[Endpoint]
 * gives the path. The route is returned so a route file chains its name, middleware and defaults.
 */
final readonly class CallRoutes implements CallRegistrar
{
    public const string CALL_DEFAULT = 'journal_call';

    public function __construct(private Router $router) {}

    /**
     * @param  class-string  $controller
     *
     * @throws EndpointDeclarationInvalid
     */
    public function register(string $controller): Route
    {
        $declaration = CallDeclaration::of(self::callOf($controller));

        return $this->router->post($declaration->endpoint->path, $controller)
            ->defaults(self::CALL_DEFAULT, $declaration->call);
    }

    /**
     * @param  class-string  $controller
     * @return class-string
     *
     * @throws EndpointDeclarationInvalid
     */
    private static function callOf(string $controller): string
    {
        $type = new ReflectionMethod($controller, '__invoke')->getParameters()[0]->getType();

        if (! $type instanceof ReflectionNamedType || ! class_exists($type->getName())) {
            throw EndpointDeclarationInvalid::for($controller, 'its __invoke takes the call first');
        }

        return $type->getName();
    }
}
