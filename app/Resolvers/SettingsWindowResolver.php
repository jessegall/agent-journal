<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\SettingsLayout;

/**
 * The settings of every owner, for the owner of the journal, as groups in the order the settings page reads in.
 */
final readonly class SettingsWindowResolver implements PageResolver
{
    public function __construct(private SettingsLayout $layout) {}

    public function read(): DeclaredLayoutData
    {
        return $this->layout->layout();
    }
}
