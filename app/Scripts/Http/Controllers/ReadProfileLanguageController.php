<?php

declare(strict_types=1);

namespace App\Scripts\Http\Controllers;

use App\Scripts\Calls\ReadProfileLanguageCall;
use App\Scripts\Contracts\ProfileLanguage;
use App\Scripts\Data\ProfileLanguageData;

/**
 * Answers the script language as it stands, for editors to highlight and complete from.
 */
final readonly class ReadProfileLanguageController
{
    public function __invoke(ReadProfileLanguageCall $call, ProfileLanguage $language): ProfileLanguageData
    {
        return $language->language();
    }
}
