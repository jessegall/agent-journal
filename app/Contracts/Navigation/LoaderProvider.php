<?php

declare(strict_types=1);

namespace App\Contracts\Navigation;

use App\Declarations\Loader;

/**
 * A part that offers loaders no page guards, such as the shell's search and notifications, which every page may call.
 */
interface LoaderProvider
{
    /**
     * @return list<Loader>
     */
    public function loaders(): array;
}
