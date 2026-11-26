<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Scripts\ScriptChecks as ScriptChecksContract;
use App\Enums\Profiles\DiagnosticCode;
use App\Exceptions\ScriptSyntaxError;
use App\Values\ObjectDefinition;
use App\Values\RegisteredKeyword;
use App\Values\ScriptCheck;
use App\Values\ScriptLine;
use App\Values\ScriptRange;
use App\Values\ScriptSource;

final readonly class ScriptChecks implements ScriptChecksContract
{
    public function __construct(
        private ScriptParser $parser,
        private ScriptCompiler $compiler,
        private ScriptKeywordRegistration $keywords,
        private ScriptObjectRegistration $objects,
    ) {}

    public function check(ScriptSource $source): ScriptCheck
    {
        $catalogue = $this->catalogueDigest();
        $tokens = [];

        try {
            $lines = self::lines($source->text);
            $tokens = array_map(fn (ScriptLine $line) => $line->source, $lines);
            $compiled = $this->compiler->compile($source, $this->parser->parse($lines));
        } catch (ScriptSyntaxError $failure) {
            return new ScriptCheck([$failure->diagnostic], $tokens, null, $source->hash(), $catalogue);
        }

        return new ScriptCheck([], $tokens, $compiled, $source->hash(), $catalogue);
    }

    /**
     * @return list<ScriptLine>
     */
    private static function lines(string $text): array
    {
        $source = preg_split('/\R/u', $text);

        if ($source === false) {
            throw ScriptSyntaxError::at(DiagnosticCode::InvalidForm, new ScriptRange(1, 1, 1), 'Expected UTF-8.');
        }

        $lines = array_map(
            fn (string $line, int $number) => ScriptLine::read($line, $number + 1),
            $source,
            array_keys($source),
        );

        return array_values(array_filter($lines, fn (ScriptLine $line) => ! $line->isBlank()));
    }

    /**
     * The digest of every registered keyword and object with its availability, which a check is made against.
     */
    public function catalogueDigest(): string
    {
        $keywords = array_map(
            fn (RegisteredKeyword $keyword) => [
                $keyword,
                $this->keywords->isAvailable($keyword),
            ],
            $this->keywords->all(),
        );

        $objects = array_map(
            fn (ObjectDefinition $object) => [
                $object,
                $this->objects->isAvailable($object),
            ],
            $this->objects->all(),
        );

        return hash('sha256', json_encode([$keywords, $objects], JSON_THROW_ON_ERROR));
    }
}
