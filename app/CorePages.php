<?php

declare(strict_types=1);

namespace App;

use App\Connections\Pages\ConnectionsPages;
use App\Processes\Pages\ProcessPages;
use App\Profiles\Pages\ProfilesPages;
use App\Scripts\Pages\ScriptsPages;
use App\Settings\Pages\SettingsPages;
use App\Sharing\Pages\SharingPages;
use App\Ui\Declarations\DomainUi;
use App\Web\Pages\WebPages;

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
