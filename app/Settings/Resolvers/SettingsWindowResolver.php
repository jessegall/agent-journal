<?php

declare(strict_types=1);

namespace App\Settings\Resolvers;

use App\Settings\Support\SettingsLayout;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;

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
