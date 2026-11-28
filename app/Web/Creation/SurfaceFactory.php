<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Support\Reflector;
use App\Support\Registry;
use App\Web\Creation\Contracts\PageBuilder;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\Exceptions\InvalidBuilder;
use App\Web\Creation\Exceptions\MissingBuilder;
use Illuminate\Container\Container;
use Illuminate\Http\Request;
use Spatie\LaravelData\Data;

/** @template TBuilder of PageBuilder|WindowBuilder */
abstract class SurfaceFactory
{
    /** @var Registry<class-string<TBuilder>> */
    private readonly Registry $builders;

    /** @param class-string<TBuilder> $contract */
    protected function __construct(
        private readonly string $surface,
        private readonly string $contract,
    ) {
        $this->builders = Registry::once(
            static fn (string $type) => MissingBuilder::forType($surface, $type),
            static fn (string $type) => InvalidBuilder::duplicate($surface, $type),
        );
    }

    /** Associates one concrete result with its builder for subsequent visits. */
    public function register(string $type, string $builder): void
    {
        if (! $this->isConcreteData($type) || ! $this->isConcreteBuilder($builder)) {
            throw InvalidBuilder::registration($this->surface, $type, $builder);
        }

        $this->builders->put($type, $builder);
    }

    /** @return class-string<TBuilder> */
    public function builderFor(string $type): string
    {
        return $this->builders->get($type);
    }

    /** Whether the declaration already has a builder for this exact type. */
    public function hasBuilderFor(string $type): bool
    {
        return $this->builders->has($type);
    }

    /**
     * @template TProduct of Data
     *
     * @param  class-string<TProduct>  $type
     * @return TProduct
     */
    public function create(string $type, Request $visit): Data
    {
        // The factory lives as long as the application; a builder is made in the container of the request it serves, so
        // it reads that request's actor and scoped services, never those of the application's first container.
        $builder = Container::getInstance()->make($this->builderFor($type));
        $product = $builder->build($visit);

        if ($product::class !== $type) {
            throw InvalidBuilder::result($builder::class, $product::class, $type);
        }

        /** @var TProduct $product */
        return $product;
    }

    private function isConcreteData(string $type): bool
    {
        $product = Reflector::find($type)->getOrElse(null);

        return $product !== null && $product->isSubclassOf(Data::class) && ! $product->isAbstract();
    }

    /** @phpstan-assert-if-true class-string<TBuilder> $builder */
    private function isConcreteBuilder(string $builder): bool
    {
        $class = Reflector::find($builder)->getOrElse(null);

        return $class !== null && $class->implements($this->contract) && $class->isInstantiable();
    }
}
