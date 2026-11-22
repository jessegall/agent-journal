<?php

declare(strict_types=1);

namespace App;

use App\Declarations\DomainUi;
use App\Pages\ConnectionsPages;
use App\Pages\ProcessPages;
use App\Pages\ProfilesPages;
use App\Pages\ScriptsPages;
use App\Pages\SettingsPages;
use App\Pages\SharingPages;
use App\Pages\WebPages;

/**
 * Core's own page declarations, served beside the domains': Web's, Sharing's, Connections', Processes', Profiles', Scripts' and Settings'.
 */
final class CorePages
{
    /**
     * @return list<DomainUi>
     */
    public static function declarations(): array
    {
        return [
            new WebPages()->declarations(),
            new SharingPages()->declarations(),
            new ConnectionsPages()->declarations(),
            new ProcessPages()->declarations(),
            new ProfilesPages()->declarations(),
            new ScriptsPages()->declarations(),
            new SettingsPages()->declarations(),
        ];
    }
}
