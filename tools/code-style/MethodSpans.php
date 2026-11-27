<?php

declare(strict_types=1);

namespace Tools\CodeStyle;

use PhpCsFixer\Tokenizer\CT;
use PhpCsFixer\Tokenizer\Tokens;

/**
 * Where each method of a class body sits in its tokens: from its docblock, attributes and modifiers to the brace or
 * semicolon that ends it, for a fixer that moves whole methods.
 */
final readonly class MethodSpans
{
    /**
     * The tokens of each method of the class whose body opens at the brace, by its name, in the order they stand.
     *
     * @return array<string, array{int, int}> the first and the last token of each method
     */
    public static function of(Tokens $tokens, int $classOpen): array
    {
        $classClose = $tokens->findBlockEnd(Tokens::BLOCK_TYPE_CURLY_BRACE, $classOpen);
        $spans = [];

        for ($index = $classOpen + 1; $index < $classClose; $index++) {
            if ($tokens[$index]->equals('{')) {
                $index = $tokens->findBlockEnd(Tokens::BLOCK_TYPE_CURLY_BRACE, $index);

                continue;
            }

            if (! $tokens[$index]->isGivenKind(T_FUNCTION)) {
                continue;
            }

            $name = $tokens->getNextMeaningfulToken($index);
            $end = self::endOf($tokens, $index);
            $spans[$tokens[$name]->getContent()] = [
                self::startOf($tokens, $index),
                $end,
            ];
            $index = $end;
        }

        return $spans;
    }

    /**
     * The token that opens the body of each class, interface, trait or enum of the file.
     *
     * @return list<int>
     */
    public static function classBodies(Tokens $tokens): array
    {
        $bodies = [];

        foreach ($tokens->findGivenKind([T_CLASS, T_TRAIT, T_ENUM]) as $found) {
            foreach (array_keys($found) as $keyword) {
                $previous = $tokens->getPrevMeaningfulToken($keyword);

                // ::class names a class and opens no body.
                if ($previous !== null && $tokens[$previous]->isGivenKind(T_DOUBLE_COLON)) {
                    continue;
                }

                $bodies[] = $tokens->getNextTokenOfKind($keyword, ['{']);
            }
        }

        return array_values(array_filter($bodies, fn (int|null $body) => $body !== null));
    }

    /**
     * The first token of the method: its docblock, attribute or modifier the furthest up, past the code before it.
     */
    private static function startOf(Tokens $tokens, int $function): int
    {
        $start = $function;
        $index = $tokens->getPrevNonWhitespace($function);

        while ($index !== null) {
            $token = $tokens[$index];

            if ($token->isGivenKind(CT::T_ATTRIBUTE_CLOSE)) {
                $index = $tokens->findBlockStart(Tokens::BLOCK_TYPE_ATTRIBUTE, $index);
                $start = $index;
                $index = $tokens->getPrevNonWhitespace($index);

                continue;
            }

            if ($token->isGivenKind([T_PUBLIC, T_PROTECTED, T_PRIVATE, T_STATIC, T_FINAL, T_ABSTRACT, T_DOC_COMMENT])) {
                $start = $index;
                $index = $tokens->getPrevNonWhitespace($index);

                continue;
            }

            break;
        }

        return $start;
    }

    /**
     * The closing brace of the method's body, or the semicolon of an abstract one.
     */
    private static function endOf(Tokens $tokens, int $function): int
    {
        $next = $tokens->getNextTokenOfKind($function, ['{', ';']);

        if ($tokens[$next]->equals(';')) {
            return $next;
        }

        return $tokens->findBlockEnd(Tokens::BLOCK_TYPE_CURLY_BRACE, $next);
    }
}
