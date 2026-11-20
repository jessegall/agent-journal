<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Scripts\Contracts\ScriptKeywordDefinition;
use App\Scripts\Contracts\ScriptStatement;
use App\Scripts\Contracts\ScriptTrigger;
use App\Scripts\Enums\KeywordCategory;
use App\Scripts\Enums\ScriptEffect;
use App\Scripts\Enums\SyntaxForm;

final readonly class KeywordDefinition implements ScriptKeywordDefinition
{
    /**
     * @param class-string<ScriptStatement|ScriptTrigger>|null $implementation
     * @param list<ScriptEffect> $effects
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

    /** @param class-string<ScriptTrigger> $implementation */
    public static function trigger(string $token, string $implementation): self
    {
        return new self($token, KeywordCategory::Trigger, SyntaxForm::Trigger, 'Run on this trigger.', $implementation);
    }

    public static function negation(): self
    {
        return new self('NOT', KeywordCategory::Operator, SyntaxForm::Negation, 'Negate a boolean member.', null);
    }

    /**
     * @param class-string<ScriptStatement> $implementation
     * @param list<ScriptEffect> $effects
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
