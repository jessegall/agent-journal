<?php

declare(strict_types=1);

namespace App\Support\Web;

use App\Contracts\UiOwnerAvailability;
use App\Declarations\RegisteredAction;
use App\Enums\ActionMethod;
use App\Support\ReflectedParameter;
use App\Support\Reflector;
use App\Support\UiDeclarations;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\Request;
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
        private UiDeclarations $declarations,
        private UiOwnerAvailability $owners,
        private PageVisibility $visibility,
        private ResponseFactory $inertia,
        private Container $container,
    ) {}

    /**
     * The prop a page read is sent as.
     */
    public static function propName(string $routeName): string
    {
        return 'read_'.str_replace(['.', '-'], '_', $routeName);
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
            $props[$prop] = $this->inertia->optional(fn () => $this->answer($action, $this->queryOf($request, $prop)));
        }

        return $props;
    }

    /**
     * What the read's controller answers for the query: its input Data built and validated from the query, a plain
     * parameter taken from the query by its name, and everything else from the container.
     *
     * @param  array<string, mixed>  $query
     */
    private function answer(RegisteredAction $action, array $query): Data
    {
        $this->visibility->assertVisible($action->guard->key);

        $controller = $this->container->make($action->action->controller);
        $arguments = [];

        foreach (Reflector::of($controller)->method('__invoke')->parameters() as $parameter) {
            $arguments = [...$arguments, ...$this->argumentFor($parameter, $query)];
        }

        return $this->container->call([$controller, '__invoke'], $arguments);
    }

    /**
     * @param  array<string, mixed>  $query
     * @return array<string, mixed>
     */
    private function argumentFor(ReflectedParameter $parameter, array $query): array
    {
        $type = $parameter->type()->map(fn ($declared) => $declared->name())->getOrElse('');

        if (is_subclass_of($type, Data::class)) {
            return [$parameter->name() => $type::validateAndCreate($query)];
        }

        return array_key_exists($parameter->name(), $query) ? [$parameter->name() => $query[$parameter->name()]] : [];
    }

    /**
     * @return array<string, mixed>
     */
    private function queryOf(Request $request, string $prop): array
    {
        $own = $request->array(self::QUERY)[$prop] ?? [];

        return is_array($own) ? $own : [];
    }
}
