<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Contracts\Sessions\ProfileLanguage;
use App\Data\Profiles\ProfileScriptPageData;
use App\Support\Readers\ProfileDraftReader;
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
