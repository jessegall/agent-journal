<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The script language as it stands now, for editors to highlight and complete from: its keywords, its objects and
 * the digest of the catalogue they came from.
 */
#[TypeScript]
final class ProfileLanguageData extends Data
{
    /**
     * @param  list<ScriptKeywordData>  $keywords
     * @param  list<ScriptObjectData>  $objects
     */
    public function __construct(
        #[DataCollectionOf(ScriptKeywordData::class)]
        public readonly array $keywords,
        #[DataCollectionOf(ScriptObjectData::class)]
        public readonly array $objects,
        public readonly string $catalogueDigest,
    ) {}
}
