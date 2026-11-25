<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Domains\ApiRegistrar as ApiRegistrarContract;
use App\Exceptions\EndpointDeclarationInvalid;
use Illuminate\Routing\Route;
use Illuminate\Routing\Router;

/**
 * Registers a signed route from its call's declaration: the controller's __invoke takes the call, whose #[Endpoint]
 * gives the path. The route is returned so a route file chains its name, middleware and defaults.
 */
final readonly class ApiRegistrar implements ApiRegistrarContract
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
        $declaration = ApiDeclaration::of(self::callOf($controller));

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
        $parameters = Reflector::of($controller)->method('__invoke')->parameters();

        $call = $parameters === [] ? '' : $parameters[0]->type()
            ->filter(fn (DeclaredType $type) => $type->isNamed())
            ->map(fn (DeclaredType $type) => $type->name())
            ->getOrElse('');

        if (! Reflector::exists($call)) {
            throw EndpointDeclarationInvalid::for($controller, 'its __invoke takes the call first');
        }

        return $call;
    }
}
