<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Data\Profiles\ProfileLanguageData;

/**
 * The script language as it stands now: its keywords, its objects and the digest of the catalogue they came from.
 */
interface ProfileLanguage
{
    /**
     * The words and kinds a profile may be written in, for the profile editor.
     */
    public function language(): ProfileLanguageData;
}
