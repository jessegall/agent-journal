<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Navigation\Declarations\DomainClient;
use App\Navigation\Exceptions\ClientResolverInvalid;
use App\Support\DeclaredType;
use App\Support\ReflectedMethod;
use App\Support\ReflectedParameter;
use App\Support\Reflector;
use Illuminate\Foundation\Http\FormRequest;
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
        DomainClient $owner,
        string $declaration,
        string $resolver,
        string $interface,
        string $dataClass,
    ): self {
        $owner->assertImplements($declaration, $resolver, $interface);

        $parameters = Reflector::of($resolver)->constructor()
            ->map(fn (ReflectedMethod $constructor) => $constructor->parameters())
            ->getOrElse([]);

        $requests = array_values(array_filter(array_map(self::requestOf(...), $parameters)));

        if (count($requests) > 1) {
            throw ClientResolverInvalid::manyRequests($declaration, $resolver);
        }

        return new self($resolver, $dataClass, $requests[0] ?? null);
    }

    /**
     * @return class-string<FormRequest>|null
     */
    private static function requestOf(ReflectedParameter $parameter): string|null
    {
        $name = $parameter->type()
            ->filter(fn (DeclaredType $declared) => $declared->isNamed())
            ->map(fn (DeclaredType $declared) => $declared->name())
            ->getOrElse('');

        if (Reflector::factory()->isSubclassOf($name, FormRequest::class)) {
            return $name;
        }

        return null;
    }
}
