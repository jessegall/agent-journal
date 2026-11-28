<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The script editor of one profile: its shared draft and the language the editor highlights and completes from.
 */
#[TypeScript]
final class ProfileScriptPageData extends Data
{
    /** @use Buildable<ProfileScriptPageDataFields> */
    use Buildable;

    protected const string FIELDS = ProfileScriptPageDataFields::class;

    public function __construct(
        public readonly ProfileDraftData $draft,
        public readonly ProfileLanguageData $language,
    ) {}
}
