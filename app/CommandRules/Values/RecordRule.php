<?php

declare(strict_types=1);

namespace App\CommandRules\Values;

use App\CommandRules\Exceptions\ReaderDefinitionInvalid;
use App\Records\Enums\RecordRole;
use Spatie\LaravelData\Data;

/**
 * One rule of a reader: a role and a pattern of literal text with named placeholders ({failed:int}, {name:word},
 * {message:rest}); a word stops at a space or a quote. The pattern compiles to an anchored expression of possessive
 * matches, so it never backtracks.
 */
final class RecordRule extends Data
{
    /**
     * What each placeholder matches: digits, a word with no space or quote, the rest of the line, or the shortest text
     * that lets the literal after it match.
     */
    private const array PLACEHOLDERS = [
        'int' => '\d++',
        'word' => '[^\s\'"]++',
        'rest' => '.*+',
        'text' => '.+?',
    ];

    /**
     * @throws ReaderDefinitionInvalid
     */
    public function __construct(public readonly RecordRole $role, public readonly string $pattern)
    {
        self::compile($pattern);
    }

    /**
     * The rule of a role and a pattern.
     *
     * @throws ReaderDefinitionInvalid
     */
    public static function of(RecordRole $role, string $pattern): self
    {
        return new self($role, $pattern);
    }

    public function matches(string $line): bool
    {
        return preg_match($this->expression(), $line) === 1;
    }

    /**
     * The named values the pattern captured from a line it matches.
     *
     * @return array<string, string>
     */
    public function captures(string $line): array
    {
        preg_match($this->expression(), $line, $match);

        return array_filter($match, fn (int|string $key) => is_string($key), ARRAY_FILTER_USE_KEY);
    }

    /**
     * The pattern compiled to its anchored expression; PCRE keeps the compiled form, so a repeat costs little.
     */
    private function expression(): string
    {
        return '/^'.self::compile($this->pattern).'$/u';
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
        if (preg_match('/^\{([a-z_]{1,32}):(int|word|rest|text)\}$/', $placeholder, $match) !== 1) {
            throw ReaderDefinitionInvalid::placeholder($placeholder);
        }

        return "(?<{$match[1]}>".self::PLACEHOLDERS[$match[2]].')';
    }
}
