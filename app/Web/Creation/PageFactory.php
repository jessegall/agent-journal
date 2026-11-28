<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Support\Reflector;
use App\Support\Registry;
use App\Web\Creation\Contracts\PageBuilder;
use App\Web\Creation\Exceptions\InvalidBuilder;
use App\Web\Creation\Exceptions\MissingBuilder;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\Request;
use Spatie\LaravelData\Data;

final class PageFactory
{
    /** @var Registry<class-string<PageBuilder>> */
    private readonly Registry $builders;

    public function __construct(private readonly Container $container)
    {
        $this->builders = Registry::once(
            fn (string $type) => MissingBuilder::forType('page', $type),
            fn (string $type) => InvalidBuilder::duplicate('page', $type),
        );
    }

    public function register(string $type, string $builder): void
    {
        if (! is_subclass_of($type, Data::class) || Reflector::of($type)->isAbstract()) {
            throw InvalidBuilder::registration('page', $type, $builder);
        }

        if (! is_subclass_of($builder, PageBuilder::class) || ! Reflector::of($builder)->isInstantiable()) {
            throw InvalidBuilder::registration('page', $type, $builder);
        }

        $this->builders->put($type, $builder);
    }

    /** @return class-string<PageBuilder> */
    public function builderFor(string $type): string
    {
        return $this->builders->get($type);
    }

    /**
     * @template TPage of Data
     * @param  class-string<TPage>  $type
     * @return TPage
     */
    public function create(string $type, Request $visit): Data
    {
        $builder = $this->container->make($this->builderFor($type));
        $page = $builder->build($visit);

        if ($page::class !== $type) {
            throw InvalidBuilder::result($builder::class, $page::class, $type);
        }

        /** @var TPage $page */
        return $page;
    }
}
