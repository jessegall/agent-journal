<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Web\Creation\Contracts\PageBuilder;

/** @extends SurfaceFactory<PageBuilder> */
final class PageFactory extends SurfaceFactory
{
    public function __construct()
    {
        parent::__construct('page', PageBuilder::class);
    }
}
