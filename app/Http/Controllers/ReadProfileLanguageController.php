<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Api\Scripts\ReadProfileLanguagePayload;
use App\Contracts\Sessions\ProfileLanguage;
use App\Data\Profiles\ProfileLanguageData;

/**
 * Answers the script language as it stands, for editors to highlight and complete from.
 */
final readonly class ReadProfileLanguageController
{
    public function __invoke(ReadProfileLanguagePayload $call, ProfileLanguage $language): ProfileLanguageData
    {
        return $language->language();
    }
}
