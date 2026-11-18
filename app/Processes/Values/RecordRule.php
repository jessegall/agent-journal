<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\RecordRole;
use App\Processes\Exceptions\ReaderDefinitionInvalid;

/**
 * One rule of a reader: a role and a pattern of literal text with named placeholders ({failed:int}, {name:word},
 * {message:rest}). The pattern compiles to an anchored expression of possessive matches, so it never backtracks.
 */
final readonly class RecordRule
{
    private const array PLACEHOLDERS = ['int' => '\d++', 'word' => '\S++', 'rest' => '.*+'];

    private function __construct(
        public RecordRole $role,
        public string $pattern,
        public string $expression,
    ) {}

    /**
     * The rule of a role and a pattern, compiled to its anchored expression.
     *
     * @throws ReaderDefinitionInvalid
     */
    public static function of(RecordRole $role, string $pattern): self
    {
        return new self($role, $pattern, '/^'.self::compile($pattern).'$/u');
    }

    public function matches(string $line): bool
    {
        return preg_match($this->expression, $line) === 1;
    }

    /**
     * The named values the pattern captured from a line it matches.
     *
     * @return array<string, string>
     */
    public function captures(string $line): array
    {
        preg_match($this->expression, $line, $match);

        return array_filter($match, fn (int|string $key): bool => is_string($key), ARRAY_FILTER_USE_KEY);
    }

    /**
     * @throws ReaderDefinitionInvalid
     */
    private static function compile(string $pattern): string
    {
        $parts = preg_split('/(\{[^{}]*\})/', $pattern, flags: PREG_SPLIT_DELIM_CAPTURE) ?: [];
        $expression = '';
        foreach ($parts as $index => $part) {
            $expression .= $index % 2 === 0 ? preg_quote($part, '/') : self::placeholder($part);
        }

        return $expression;
    }

    /**
     * @throws ReaderDefinitionInvalid
     */
    private static function placeholder(string $placeholder): string
    {
        if (preg_match('/^\{([a-z_]{1,32}):(int|word|rest)\}$/', $placeholder, $match) !== 1) {
            throw ReaderDefinitionInvalid::placeholder($placeholder);
        }

        return "(?<{$match[1]}>".self::PLACEHOLDERS[$match[2]].')';
    }
}
