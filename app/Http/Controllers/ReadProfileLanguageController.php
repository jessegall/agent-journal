<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Calls\Scripts\ReadProfileLanguageCall;
use App\Contracts\Sessions\ProfileLanguage;
use App\Data\ProfileLanguageData;

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
