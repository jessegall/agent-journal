<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Scripts\ScriptKeywordDefinition as ScriptKeywordDefinitionContract;
use App\Contracts\Scripts\ScriptStatement;
use App\Contracts\Scripts\ScriptTrigger;
use App\Enums\CommandRules\SyntaxForm;
use App\Enums\Profiles\KeywordCategory;
use App\Enums\Profiles\ScriptEffect;

final readonly class ScriptKeywordDefinition implements ScriptKeywordDefinitionContract
{
    /**
     * @param  class-string<ScriptStatement|ScriptTrigger>|null  $implementation
     * @param  list<ScriptEffect>  $effects
     */
    private function __construct(
        public string $token,
        public KeywordCategory $category,
        public SyntaxForm $form,
        public string $documentation,
        public string|null $implementation,
        public array $effects = [],
    ) {}

    public static function structure(string $token, SyntaxForm $form, string $documentation): self
    {
        return new self($token, KeywordCategory::Structure, $form, $documentation, null);
    }

    /**
     * @param  class-string<ScriptTrigger>  $implementation
     */
    public static function trigger(string $token, string $implementation): self
    {
        return new self($token, KeywordCategory::Trigger, SyntaxForm::Trigger, 'Run on this trigger.', $implementation);
    }

    public static function negation(): self
    {
        return new self('NOT', KeywordCategory::Operator, SyntaxForm::Negation, 'Negate a boolean member.', null);
    }

    /**
     * @param  class-string<ScriptStatement>  $implementation
     * @param  list<ScriptEffect>  $effects
     */
    public static function statement(
        string $token,
        SyntaxForm $form,
        string $implementation,
        string $documentation,
        array $effects = [],
    ): self {
        return new self($token, KeywordCategory::Statement, $form, $documentation, $implementation, $effects);
    }

    public function token(): string
    {
        return $this->token;
    }
}
