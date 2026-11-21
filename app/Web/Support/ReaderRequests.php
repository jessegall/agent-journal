<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Reflection\Contracts\ReflectorFactory;
use App\Reflection\Support\DeclaredType;
use App\Reflection\Support\ReflectedMethod;
use App\Ui\Contracts\PageResolver;
use App\Ui\Contracts\SectionResolver;
use App\Ui\Declarations\ResolverDefinition;
use App\Ui\Exceptions\UiResolverInvalid;
use App\Web\Contracts\ReaderRequests as ReaderRequestsContract;
use Illuminate\Contracts\Container\Container;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Routing\Route;

/**
 * Builds a declared reader for this request: its own request class, filled with only the query it is given and the
 * same user and route, validated through the framework's usual pipeline and handed to the reader's constructor. The
 * shared request and actor bindings are never replaced.
 */
final readonly class ReaderRequests implements ReaderRequestsContract
{
    public function __construct(
        private Container $container,
        private Redirector $redirector,
        private ReflectorFactory $reflectors,
    ) {}

    /**
     * @param  array<string, mixed>  $query
     */
    public function pageReader(
        string $key,
        ResolverDefinition $resolver,
        Request $current,
        array $query,
        Route|null $route = null,
    ): PageResolver {
        $built = $this->build($resolver, $current, $query, $route);

        return $built instanceof PageResolver ? $built : throw UiResolverInvalid::notA(
            $key,
            $resolver->resolver,
            PageResolver::class,
        );
    }

    /**
     * A section reads the page's plain query.
     */
    public function sectionReader(string $key, ResolverDefinition $resolver, Request $current): SectionResolver
    {
        $built = $this->build($resolver, $current, $current->query->all(), null);

        return $built instanceof SectionResolver ? $built : throw UiResolverInvalid::notA(
            $key,
            $resolver->resolver,
            SectionResolver::class,
        );
    }

    /**
     * @param  array<string, mixed>  $query
     * @param  Route|null  $route  the route the reader reads its parameters from, when not the current one
     */
    private function build(ResolverDefinition $resolver, Request $current, array $query, Route|null $route): object
    {
        if ($resolver->request === null) {
            return $this->container->make($resolver->resolver);
        }

        $request = $resolver->request::createFrom($current, new $resolver->request());
        $request->query->replace($query);

        if ($route !== null) {
            $request->setRouteResolver(fn () => $route);
        }

        $request->setContainer($this->container)->setRedirector($this->redirector);
        $request->validateResolved();

        return $this->container->makeWith(
            $resolver->resolver,
            [$this->parameterFor($resolver->resolver, $request) => $request],
        );
    }

    /**
     * @param  class-string  $class
     */
    private function parameterFor(string $class, FormRequest $request): string
    {
        $parameters = $this->reflectors->make($class)->constructor()
            ->map(fn (ReflectedMethod $constructor) => $constructor->parameters())
            ->getOrElse([]);

        foreach ($parameters as $parameter) {
            if ($parameter->type()->filter(fn (DeclaredType $type) => $type->isNamedAs($request::class))->isDefined()) {
                return $parameter->name();
            }
        }

        return '';
    }
}
