<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Navigation\Contracts\PageResolver;
use App\Processes\Readers\ProfileDraftReader;
use App\Profiles\Data\ProfileScriptPageData;
use App\Sessions\Contracts\ProfileLanguage;
use App\Values\ProfileKey;
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
