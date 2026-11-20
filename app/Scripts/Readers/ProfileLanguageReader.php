<?php

declare(strict_types=1);

namespace App\Scripts\Readers;

use App\Scripts\Contracts\ProfileLanguage;
use App\Scripts\Data\ProfileLanguageData;
use App\Scripts\Data\ScriptKeywordData;
use App\Scripts\Data\ScriptObjectData;
use App\Scripts\Support\KeywordRegistry;
use App\Scripts\Support\ObjectRegistry;
use App\Scripts\Support\ScriptChecker;
use App\Scripts\Values\KeywordDefinition;
use App\Scripts\Values\ObjectDefinition;
use App\Scripts\Values\RegisteredKeyword;

/**
 * Reads the script language from the registered keywords and objects, so a new keyword or object reaches every
 * editor with no change to the editor.
 */
final readonly class ProfileLanguageReader implements ProfileLanguage
{
    public function __construct(
        private KeywordRegistry $keywords,
        private ObjectRegistry $objects,
        private ScriptChecker $checker,
    ) {}

    public function language(): ProfileLanguageData
    {
        $keywords = array_values(array_filter(array_map(
            fn (RegisteredKeyword $keyword) => $this->keyword($keyword),
            $this->keywords->all(),
        )));
        $objects = array_map(
            fn (ObjectDefinition $object) => ScriptObjectData::fromDefinition(
                $object,
                $this->objects->isAvailable($object),
            ),
            $this->objects->all(),
        );

        return ProfileLanguageData::from([
            'keywords' => $keywords,
            'objects' => $objects,
            'catalogueDigest' => $this->checker->catalogueDigest(),
        ]);
    }

    private function keyword(RegisteredKeyword $registered): ScriptKeywordData|null
    {
        $definition = $registered->definition;

        if (! $definition instanceof KeywordDefinition) {
            return null;
        }

        return ScriptKeywordData::fromDefinition(
            $definition,
            $this->keywords->portsOf($definition),
            $this->keywords->isAvailable($registered),
        );
    }
}
