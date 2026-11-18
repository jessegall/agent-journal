<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Ui\Contracts\PageReader;
use App\Ui\Contracts\SectionReader;
use App\Ui\Declarations\ReaderDefinition;
use App\Ui\Exceptions\UiReaderInvalid;
use Illuminate\Contracts\Container\Container;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Routing\Route;
use ReflectionClass;
use ReflectionNamedType;

/**
 * Builds a declared reader for this request: its own request class, filled with only the query it is given and the
 * same user and route, validated through the framework's usual pipeline and handed to the reader's constructor. The
 * shared request and actor bindings are never replaced.
 */
final readonly class ReaderRequests
{
    public function __construct(
        private Container $container,
        private Redirector $redirector,
    ) {}

    /**
     * @param  array<string, mixed>  $query
     */
    public function pageReader(string $key, ReaderDefinition $reader, Request $current, array $query, Route|null $route = null): PageReader
    {
        $built = $this->build($reader, $current, $query, $route);

        return $built instanceof PageReader ? $built : throw UiReaderInvalid::notA($key, $reader->reader, PageReader::class);
    }

    /**
     * A section reads the page's plain query.
     */
    public function sectionReader(string $key, ReaderDefinition $reader, Request $current): SectionReader
    {
        $built = $this->build($reader, $current, $current->query->all(), null);

        return $built instanceof SectionReader ? $built : throw UiReaderInvalid::notA($key, $reader->reader, SectionReader::class);
    }

    /**
     * @param  array<string, mixed>  $query
     * @param  Route|null  $route  the route the reader reads its parameters from, when not the current one
     */
    private function build(ReaderDefinition $reader, Request $current, array $query, Route|null $route): object
    {
        if ($reader->request === null) {
            return $this->container->make($reader->reader);
        }

        $request = $reader->request::createFrom($current, new $reader->request());
        $request->query->replace($query);

        if ($route !== null) {
            $request->setRouteResolver(fn () => $route);
        }

        $request->setContainer($this->container)->setRedirector($this->redirector);
        $request->validateResolved();

        return $this->container->makeWith($reader->reader, [$this->parameterFor($reader->reader, $request) => $request]);
    }

    /**
     * @param  class-string  $readerClass
     */
    private function parameterFor(string $readerClass, FormRequest $request): string
    {
        foreach (new ReflectionClass($readerClass)->getConstructor()?->getParameters() ?? [] as $parameter) {
            $type = $parameter->getType();

            if ($type instanceof ReflectionNamedType && $type->getName() === $request::class) {
                return $parameter->getName();
            }
        }

        return '';
    }
}
