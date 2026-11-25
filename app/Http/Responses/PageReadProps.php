<?php

declare(strict_types=1);

namespace App\Http\Responses;

use App\Contracts\Navigation\ClientOwnerAvailability;
use App\Contracts\Reflection\ReflectorFactory;
use App\Declarations\RegisteredAction;
use App\Enums\Settings\ActionMethod;
use App\Exceptions\PageReadParameterMissing;
use App\Support\ClientDeclarations;
use App\Support\ReflectedParameter;
use App\Support\Reflector;
use App\Support\Web\PageVisibility;
use Illuminate\Contracts\Container\Container;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Routing\Route;
use Inertia\ResponseFactory;
use Spatie\LaravelData\Data;

/**
 * The reads a page declares beside its own result (ActionRoute::get), each a shared prop read only by a partial reload
 * that names it: read_<route name> with dots and dashes as underscores, so a page asks for it with
 * router.reload({ only: [prop], data: { read: { [prop]: query } } }) on whatever page shows it. Each read is refused as
 * missing where its page or section is, and its controller's input validates the query it is given.
 */
final readonly class PageReadProps
{
    /**
     * The query parameter that holds each read's own query, by its prop.
     */
    public const string QUERY = 'read';

    public function __construct(
        private ClientDeclarations $declarations,
        private ClientOwnerAvailability $owners,
        private PageVisibility $visibility,
        private ResponseFactory $inertia,
        private Container $container,
        private ReflectorFactory $reflectors,
        private Redirector $redirector,
    ) {}

    /**
     * The prop a page read is sent as.
     */
    public static function propName(string $routeName): string
    {
        return 'read_'.str_replace([
            '.',
            '-',
        ], '_', $routeName);
    }

    /**
     * @return array<string, mixed>
     */
    public function of(Request $request): array
    {
        $props = [];

        foreach ($this->declarations->actions() as $action) {
            if ($action->action->method !== ActionMethod::Get || ! $this->owners->isAvailable($action->owner)) {
                continue;
            }

            $prop = self::propName($action->routeName);
            $query = $this->queryOf($request, $prop);
            $props[$prop] = $this->inertia->optional(fn () => $this->answer($action, $request, $query));
        }

        return $props;
    }

    /**
     * What the read's controller answers for the query: its input Data or form request built and validated from the
     * query, a plain parameter taken from the query by its name, and everything else from the container.
     *
     * @param  array<string, mixed>  $query
     * @return Data|array<string, mixed>
     */
    private function answer(RegisteredAction $action, Request $request, array $query): Data|array
    {
        $this->visibility->assertVisible($action->guard->key);

        $controller = $action->action->controller;
        $arguments = [];

        $invoke = $this->reflectors->make($controller)->method('__invoke');

        foreach ($invoke->parameters() as $parameter) {
            $arguments = [...$arguments, ...$this->argumentFor($action, $parameter, $request, $query)];
        }

        return $this->container->call("{$controller}@__invoke", $arguments);
    }

    /**
     * @param  array<string, mixed>  $query
     * @return array<string, mixed>
     */
    private function argumentFor(
        RegisteredAction $action,
        ReflectedParameter $parameter,
        Request $request,
        array $query,
    ): array {
        $type = $parameter->type()->map(fn ($declared) => $declared->name())->getOrElse('');

        if (! Reflector::exists($type)) {
            $name = $parameter->name();

            if (array_key_exists($name, $query)) {
                return [$name => $query[$name]];
            }

            return [];
        }

        $declared = $this->reflectors->make($type);

        if ($declared->isSubclassOf(Data::class)) {
            return [$parameter->name() => $declared->name()::validateAndCreate($query)];
        }

        if ($declared->isSubclassOf(FormRequest::class)) {
            return [$parameter->name() => $this->formRequestOf($declared->name(), $action, $request, $query)];
        }

        if (array_key_exists($parameter->name(), $query)) {
            return [$parameter->name() => $query[$parameter->name()]];
        }

        return [];
    }

    /**
     * The read's form request over its own query, validated as a route would validate it.
     *
     * @template T of FormRequest
     *
     * @param  class-string<T>  $type
     * @param  array<string, mixed>  $query
     * @return T
     */
    private function formRequestOf(string $type, RegisteredAction $action, Request $request, array $query): FormRequest
    {
        $form = $type::createFrom($request->duplicate($query));
        $route = $this->routeOf($action, $query);
        $form->setRouteResolver(fn () => $route);
        $form->setContainer($this->container)->setRedirector($this->redirector);
        $form->validateResolved();

        return $form;
    }

    /**
     * The read's own route, bound to the route parameters its query names, as the form request reads them.
     *
     * @param  array<string, mixed>  $query
     */
    private function routeOf(RegisteredAction $action, array $query): Route
    {
        $method = $action->action->method;
        $route = new Route([$method->value], $action->uri, []);
        $names = $action->path->parameters;
        $parameters = array_map(fn (string $name) => $this->routeParameterOf($action, $query, $name), $names);

        $address = strtr(
            $action->uri,
            array_combine(array_map(fn (string $name) => '{'.$name.'}', $action->path->parameters), $parameters),
        );

        return $route->bind(Request::create('/'.$address));
    }

    /**
     * A route parameter the read's query must name, refused as missing when it does not.
     *
     * @param  array<string, mixed>  $query
     */
    private function routeParameterOf(RegisteredAction $action, array $query, string $name): string
    {
        $parameter = $query[$name] ?? null;

        if (! is_string($parameter) || $parameter === '') {
            throw PageReadParameterMissing::for($action->routeName, $name);
        }

        return $parameter;
    }

    /**
     * @return array<string, mixed>
     */
    private function queryOf(Request $request, string $prop): array
    {
        $own = $request->array(self::QUERY)[$prop] ?? [];

        if (is_array($own)) {
            return $own;
        }

        return [];
    }
}
