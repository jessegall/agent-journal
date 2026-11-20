<?php

declare(strict_types=1);

namespace App\Ui\Declarations;

use App\Ui\Exceptions\UiResolverInvalid;
use Illuminate\Foundation\Http\FormRequest;
use ReflectionClass;
use ReflectionNamedType;
use ReflectionParameter;
use Spatie\LaravelData\Data;

/**
 * A checked page or section resolver: its class, the Data class its read method returns, and the one form request its
 * constructor takes, if any. The container builds the reader per request; this holds only class names.
 */
final readonly class ResolverDefinition
{
    /**
     * @param  class-string  $resolver
     * @param  class-string<Data>  $dataClass
     * @param  class-string<FormRequest>|null  $request  null when the reader reads no request
     */
    private function __construct(
        public string $resolver,
        public string $dataClass,
        public string|null $request,
    ) {}

    /**
     * @param  class-string  $resolver
     * @param  class-string  $interface  PageResolver or SectionResolver
     * @param  class-string<Data>  $dataClass
     */
    public static function of(
        DomainUi $owner,
        string $declaration,
        string $resolver,
        string $interface,
        string $dataClass,
    ): self {
        $owner->assertImplements($declaration, $resolver, $interface);

        $constructor = new ReflectionClass($resolver)->getConstructor();
        $parameters = $constructor === null ? [] : $constructor->getParameters();
        $requests = array_values(array_filter(array_map(self::requestOf(...), $parameters)));

        if (count($requests) > 1) {
            throw UiResolverInvalid::manyRequests($declaration, $resolver);
        }

        return new self($resolver, $dataClass, $requests[0] ?? null);
    }

    /**
     * @return class-string<FormRequest>|null
     */
    private static function requestOf(ReflectionParameter $parameter): string|null
    {
        $type = $parameter->getType();

        if (! $type instanceof ReflectionNamedType || ! is_subclass_of($type->getName(), FormRequest::class)) {
            return null;
        }

        return $type->getName();
    }
}
