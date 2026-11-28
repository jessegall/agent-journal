<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Processes\Readers\ProfileDraftReader;
use App\Profiles\Data\ProfileScriptPageData;
use App\Sessions\Contracts\ProfileLanguage;
use App\Values\ProfileKey;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * Reads a profile's shared script draft and the language for the owner's script editor.
 */
final readonly class ProfileScriptPageBuilder implements PageBuilder
{
    public function __construct(
        private ProfileDraftReader $drafts,
        private ProfileLanguage $language,
    ) {}

    public function build(Request $visit): ProfileScriptPageData
    {
        $profile = ProfileKey::from((string) $visit->route('profile'));

        return ProfileScriptPageData::build()
            ->draft($this->drafts->draft($profile))
            ->language($this->language->language())
            ->finish();
    }
}
