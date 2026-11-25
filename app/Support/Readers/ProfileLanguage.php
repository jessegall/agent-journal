<?php

declare(strict_types=1);

namespace App\Support\Readers;

use App\Contracts\Sessions\ProfileLanguage as ProfileLanguageContract;
use App\Data\Profiles\ProfileLanguageData;
use App\Data\Profiles\ScriptKeywordData;
use App\Data\Profiles\ScriptObjectData;
use App\Support\ScriptChecks;
use App\Support\ScriptKeywordRegistration;
use App\Support\ScriptObjectRegistration;
use App\Values\ObjectDefinition;
use App\Values\RegisteredKeyword;
use App\Values\ScriptKeywordDefinition;

/**
 * Reads the script language from the registered keywords and objects, so a new keyword or object reaches every
 * editor with no change to the editor.
 */
final readonly class ProfileLanguage implements ProfileLanguageContract
{
    public function __construct(
        private ScriptKeywordRegistration $keywords,
        private ScriptObjectRegistration $objects,
        private ScriptChecks $checker,
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

        if (! $definition instanceof ScriptKeywordDefinition) {
            return null;
        }

        return ScriptKeywordData::fromDefinition(
            $definition,
            $this->keywords->portsOf($definition),
            $this->keywords->isAvailable($registered),
        );
    }
}
