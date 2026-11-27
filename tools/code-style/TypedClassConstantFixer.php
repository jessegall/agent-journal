<?php

declare(strict_types=1);

namespace Tools\CodeStyle;

use PhpCsFixer\Fixer\FixerInterface;
use PhpCsFixer\FixerDefinition\CodeSample;
use PhpCsFixer\FixerDefinition\FixerDefinition;
use PhpCsFixer\FixerDefinition\FixerDefinitionInterface;
use PhpCsFixer\Tokenizer\CT;
use PhpCsFixer\Tokenizer\Token;
use PhpCsFixer\Tokenizer\Tokens;
use SplFileInfo;

/**
 * A class constant declares its type: the fixer writes string, int, float, bool or array from the one literal its
 * value is; a constant whose value is an expression or another constant is left to its author, whom the PHPStan rule
 * TypedClassConstantRule still names.
 */
final class TypedClassConstantFixer implements FixerInterface
{
    public function getName(): string
    {
        return 'Journal/typed_class_constant';
    }

    public function getDefinition(): FixerDefinitionInterface
    {
        return new FixerDefinition(
            'A class constant whose value is one literal declares the type of that literal.',
            [new CodeSample("<?php\nclass A\n{\n    private const LIMIT = 3;\n}\n")],
        );
    }

    public function isCandidate(Tokens $tokens): bool
    {
        return $tokens->isTokenKindFound(T_CONST);
    }

    public function isRisky(): bool
    {
        return false;
    }

    public function getPriority(): int
    {
        return 0;
    }

    public function supports(SplFileInfo $file): bool
    {
        return new ProjectFolders(['app', 'domain', 'tests', 'tools'])->holds($file);
    }

    public function fix(SplFileInfo $file, Tokens $tokens): void
    {
        $found = $tokens->findGivenKind(T_CONST);

        foreach (array_reverse(array_keys($found)) as $const) {
            if (! $this->isInClassBody($tokens, $const)) {
                continue;
            }

            $name = $tokens->getNextMeaningfulToken($const);
            $equals = $tokens->getNextMeaningfulToken($name);

            // A typed constant has its type between const and its name.
            if (! $tokens[$equals]->equals('=')) {
                continue;
            }

            $type = $this->typeOfValue($tokens, $equals);

            if ($type === null) {
                continue;
            }

            $tokens->insertAt($name, [new Token([T_STRING, $type]), new Token([T_WHITESPACE, ' '])]);
        }
    }

    /**
     * Whether the const keyword declares a member of a class, interface, trait or enum, rather than a constant of
     * the file, which PHP does not let declare a type.
     */
    private function isInClassBody(Tokens $tokens, int $const): bool
    {
        $previous = $tokens->getPrevMeaningfulToken($const);

        return $previous !== null && ($tokens[$previous]->equalsAny(['{', '}', ';'])
            || $tokens[$previous]->isGivenKind([T_PUBLIC, T_PROTECTED, T_PRIVATE, T_FINAL, CT::T_ATTRIBUTE_CLOSE]))
            && $this->depthOf($tokens, $const) > 0;
    }

    /**
     * How many braces are open at the token.
     */
    private function depthOf(Tokens $tokens, int $at): int
    {
        $depth = 0;

        for ($index = 0; $index < $at; $index++) {
            $opens = $tokens[$index]->isGivenKind([T_CURLY_OPEN, T_DOLLAR_OPEN_CURLY_BRACES]);

            if ($tokens[$index]->equals('{') || $opens) {
                $depth++;
            }

            if ($tokens[$index]->equals('}')) {
                $depth--;
            }
        }

        return $depth;
    }

    /**
     * The type of the one literal after the equals sign, up to the semicolon; none for anything else.
     */
    private function typeOfValue(Tokens $tokens, int $equals): string|null
    {
        $first = $tokens->getNextMeaningfulToken($equals);
        $token = $tokens[$first];

        if ($token->equals('-')) {
            $first = $tokens->getNextMeaningfulToken($first);
            $token = $tokens[$first];
        }

        [$type, $last] = match (true) {
            $token->isGivenKind(T_CONSTANT_ENCAPSED_STRING) => [
                'string',
                $first,
            ],
            $token->isGivenKind(T_LNUMBER) => [
                'int',
                $first,
            ],
            $token->isGivenKind(T_DNUMBER) => [
                'float',
                $first,
            ],
            $token->isGivenKind(T_STRING) && in_array(strtolower($token->getContent()), [
                'true',
                'false',
            ], true) => [
                'bool',
                $first,
            ],
            $token->isGivenKind(CT::T_ARRAY_SQUARE_BRACE_OPEN) => [
                'array',
                $tokens->findBlockEnd(Tokens::BLOCK_TYPE_ARRAY_SQUARE_BRACE, $first),
            ],
            $token->isGivenKind(T_START_HEREDOC) => [
                'string',
                $tokens->getNextTokenOfKind($first, [[T_END_HEREDOC]]),
            ],
            default => [
                null,
                $first,
            ],
        };

        if ($type === null || ! $tokens[$tokens->getNextMeaningfulToken($last)]->equals(';')) {
            return null;
        }

        return $type;
    }
}
