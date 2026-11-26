<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The script editor of one profile: its shared draft and the language the editor highlights and completes from.
 */
#[TypeScript]
final class ProfileScriptPageData extends Data
{
    public function __construct(
        public readonly ProfileDraftData $draft,
        public readonly ProfileLanguageData $language,
    ) {}
}
