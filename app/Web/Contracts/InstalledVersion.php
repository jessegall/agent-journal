<?php

declare(strict_types=1);

namespace App\Web\Contracts;

/**
 * What other Core areas use of the Web area's InstalledVersion.
 */
interface InstalledVersion
{
    /**
     * The release tag of a commit on main, else the short commit hash.
     */
    public function label(): string;
}
