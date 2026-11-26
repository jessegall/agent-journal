<?php

declare(strict_types=1);

namespace App\Reads;

use App\Declarations\ResolverDefinition;
use App\Navigation\Contracts\PageResolver;
use App\Navigation\Contracts\SectionResolver;
use App\Navigation\Exceptions\ClientResolverInvalid;
use App\Reads\Contracts\ReaderRequests as ReaderRequestsContract;
use App\Reflection\Contracts\ReflectorFactory;
use App\Support\DeclaredType;
use App\Support\ReflectedMethod;
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

        if ($built instanceof PageResolver) {
            return $built;
        }

        throw ClientResolverInvalid::notA(
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

        if ($built instanceof SectionResolver) {
            return $built;
        }

        throw ClientResolverInvalid::notA(
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
