<?php

declare(strict_types=1);

namespace App;

use App\Processes\Pages\ProcessPages;
use App\Sharing\Pages\SharingPages;
use App\Ui\Declarations\DomainUi;
use App\Web\Pages\WebPages;

/**
 * Core's own page declarations, served beside the domains': Web's and Sharing's.
 */
final class CorePages
{
    /**
     * @return list<DomainUi>
     */
    public static function declarations(): array
    {
        return [new WebPages()->declarations(), new SharingPages()->declarations(), new ProcessPages()->declarations()];
    }
}
