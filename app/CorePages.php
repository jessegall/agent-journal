<?php

declare(strict_types=1);

namespace App;

use App\Http\Pages\LoginPageBuilder;
use App\Navigation\Declarations\DomainClient;
use App\Pages\ConnectionsPages;
use App\Pages\LoginPage;
use App\Pages\ProcessPages;
use App\Pages\ProfilesPages;
use App\Pages\ScriptsPages;
use App\Pages\SettingsPages;
use App\Pages\SharingPages;
use App\Pages\ShellLoaders;
use App\Pages\WebPages;
use App\Web\Creation\SurfaceDefinition;

/**
 * Core's own page declarations, served beside the domains': Web's, Connections', Processes', Profiles', Scripts',
 * Settings', Sharing's and the shell's loaders.
 */
final class CorePages
{
    public static function login(): SurfaceDefinition
    {
        return new SurfaceDefinition(LoginPage::class, LoginPageBuilder::class, LoginPage::COMPONENT);
    }

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
            new SharingPages()->declarations(),
            new ShellLoaders()->declarations(),
        ];
    }
}
