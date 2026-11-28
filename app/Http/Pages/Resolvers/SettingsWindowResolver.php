<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Http\Pages\Settings\SettingsIndex;
use App\Http\Requests\Connections\ConnectProjectRequest;
use App\Navigation\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;

/**
 * The settings of every owner, for the owner of the journal, as groups in the order the settings page reads in.
 */
final readonly class SettingsWindowResolver implements PageResolver
{
    public function __construct(private SettingsIndex $layout, private ConnectProjectRequest $request) {}

    public function read(): DeclaredLayoutData
    {
        return $this->layout->layout($this->request->cursors());
    }
}
