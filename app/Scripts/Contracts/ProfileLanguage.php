<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

use App\Scripts\Data\ProfileLanguageData;

/**
 * The script language as it stands now: its keywords, its objects and the digest of the catalogue they came from.
 */
interface ProfileLanguage
{
    public function language(): ProfileLanguageData;
}
