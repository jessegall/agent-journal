<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Contracts\Container\Container;

/** @extends SurfaceFactory<PageBuilder> */
final class PageFactory extends SurfaceFactory
{
    public function __construct(Container $container)
    {
        parent::__construct($container, 'page', PageBuilder::class);
    }
}
