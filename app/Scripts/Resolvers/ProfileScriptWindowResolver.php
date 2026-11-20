<?php

declare(strict_types=1);

namespace App\Scripts\Resolvers;

use App\Profiles\Values\ProfileKey;
use App\Scripts\Contracts\ProfileLanguage;
use App\Scripts\Data\ProfileScriptPageData;
use App\Scripts\Readers\ProfileDraftReader;
use App\Ui\Contracts\PageResolver;
use Illuminate\Http\Request;

/**
 * Reads a profile's shared script draft and the language for the owner's script editor.
 */
final readonly class ProfileScriptWindowResolver implements PageResolver
{
    public function __construct(
        private Request $request,
        private ProfileDraftReader $drafts,
        private ProfileLanguage $language,
    ) {}

    public function read(): ProfileScriptPageData
    {
        $profile = ProfileKey::from((string) $this->request->route('profile'));

        return ProfileScriptPageData::from([
            'draft' => $this->drafts->draft($profile),
            'language' => $this->language->language(),
        ]);
    }
}
