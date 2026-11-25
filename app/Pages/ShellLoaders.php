<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\Navigation\LoaderProvider;
use App\Contracts\Records\TypeProvider;
use App\Declarations\DomainClient;

/**
 * The loaders of the shell around every page, under the key shell: no page guards them, only the member gate.
 */
final class ShellLoaders implements LoaderProvider, TypeProvider
{
    public function loaders(): array
    {
        return [];
    }

    /**
     * The input and answer Data of the shell's loaders, generated in the web module.
     */
    public function types(): array
    {
        return [];
    }

    /**
     * The shell's loaders under its own key, shell, as checked with the domains' declarations.
     */
    public function declarations(): DomainClient
    {
        return DomainClient::ofCore($this, 'Shell', 'shell');
    }
}
