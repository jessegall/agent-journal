<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class ProfileScriptPageDataFields
{
    private ProfileDraftData $draft;

    private ProfileLanguageData $language;

    public function draft(ProfileDraftData $draft): self
    {
        $this->draft = $draft;

        return $this;
    }

    public function language(ProfileLanguageData $language): self
    {
        $this->language = $language;

        return $this;
    }

    public function finish(): ProfileScriptPageData
    {
        if (! isset($this->draft)) {
            throw MissingFields::forType(ProfileScriptPageData::class, 'draft');
        }

        if (! isset($this->language)) {
            throw MissingFields::forType(ProfileScriptPageData::class, 'language');
        }

        return new ProfileScriptPageData(
            draft: $this->draft,
            language: $this->language,
        );
    }
}
