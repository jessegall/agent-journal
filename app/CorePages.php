<?php

declare(strict_types=1);

namespace App;

use App\Navigation\Declarations\DomainClient;
use App\Pages\ConnectionsPages;
use App\Pages\ProcessPages;
use App\Pages\ProfilesPages;
use App\Pages\ScriptsPages;
use App\Pages\SettingsPages;
use App\Pages\ShellLoaders;
use App\Pages\WebPages;

/**
 * Core's own page declarations, served beside the domains': Web's, Connections', Processes', Profiles', Scripts',
 * Settings' and the shell's loaders.
 */
final class CorePages
{
    /**
     * @return list<DomainClient>
     */
    public static function declarations(): array
    {
        return [
            new WebPages()->declarations(),
            new ConnectionsPages()->declarations(),
            new ProcessPages()->declarations(),
            new ProfilesPages()->declarations(),
            new ScriptsPages()->declarations(),
            new SettingsPages()->declarations(),
            new ShellLoaders()->declarations(),
        ];
    }
}
