<?php

declare(strict_types=1);

namespace App\Contracts\Settings;

use App\Data\SettingsCatalogueData;
use App\Exceptions\SettingsAccessDenied;
use App\Exceptions\SettingsDocumentInvalid;
use App\Exceptions\SettingsOwnerUnknown;

/**
 * Everything one owner's settings hold, for whoever the access policy lets inspect and change settings: the revision,
 * every group and setting in declaration order, defaults, stored values, and which stored values are invalid.
 */
interface SettingsCatalogue
{
    /**
     * @throws SettingsAccessDenied
     * @throws SettingsOwnerUnknown
     * @throws SettingsDocumentInvalid
     */
    public function owner(string $owner): SettingsCatalogueData;

    /**
     * Every owner's catalogue in the order the owners are declared, from one read of their records.
     *
     * @return list<SettingsCatalogueData>
     *
     * @throws SettingsAccessDenied
     * @throws SettingsDocumentInvalid
     */
    public function everyOwner(): array;
}
