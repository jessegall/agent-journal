<?php

declare(strict_types=1);

namespace App\Support\Readers;

use App\Contracts\Sessions\ProfileLanguage;
use App\Data\ProfileLanguageData;
use App\Data\ScriptKeywordData;
use App\Data\ScriptObjectData;
use App\Support\KeywordRegistry;
use App\Support\ObjectRegistry;
use App\Support\ScriptChecker;
use App\Values\KeywordDefinition;
use App\Values\ObjectDefinition;
use App\Values\RegisteredKeyword;

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
