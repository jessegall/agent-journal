<?php

declare(strict_types=1);

namespace Tools\CodeStyle;

use PhpCsFixer\Fixer\FixerInterface;
use PhpCsFixer\FixerDefinition\CodeSample;
use PhpCsFixer\FixerDefinition\FixerDefinition;
use PhpCsFixer\FixerDefinition\FixerDefinitionInterface;
use PhpCsFixer\Tokenizer\Token;
use PhpCsFixer\Tokenizer\Tokens;
use SplFileInfo;

/**
 * A blank line follows every closing brace alone on its line that a statement follows at the same indentation (rule
 * 52); a brace followed by else, catch, finally, while, another closing brace or bracket, a chained call, a comment,
 * a case or a trait use keeps its place.
 */
final class BlankLineAfterBlockFixer implements FixerInterface
{
    /**
     * The first tokens after a closing brace that go on with what the brace closed.
     */
    private const array KEEPS_ITS_PLACE = [
        T_ELSE,
        T_ELSEIF,
        T_CATCH,
        T_FINALLY,
        T_WHILE,
        T_OBJECT_OPERATOR,
        T_NULLSAFE_OBJECT_OPERATOR,
        T_COMMENT,
        T_DOC_COMMENT,
        T_CASE,
        T_DEFAULT,
        T_USE,
        T_CLOSE_TAG,
    ];

    public function getName(): string
    {
        return 'Journal/blank_line_after_block';
    }

    public function getDefinition(): FixerDefinitionInterface
    {
        return new FixerDefinition(
            'A statement after a closing brace at the same indentation has a blank line above it.',
            [new CodeSample("<?php\nif (\$a) {\n    \$b = 1;\n}\n\$c = 2;\n")],
        );
    }

    public function isCandidate(Tokens $tokens): bool
    {
        return $tokens->isTokenKindFound('}');
    }

    public function isRisky(): bool
    {
        return false;
    }

    public function getPriority(): int
    {
        return -50;
    }

    public function supports(SplFileInfo $file): bool
    {
        return new ProjectFolders(['app', 'domain', 'tests'])->holds($file);
    }

    public function fix(SplFileInfo $file, Tokens $tokens): void
    {
        for ($index = $tokens->count() - 2; $index > 0; $index--) {
            if (! $tokens[$index]->equals('}') || ! $this->standsAlone($tokens, $index)) {
                continue;
            }

            $gap = $tokens[$index + 1];

            if (! $gap->isWhitespace() || substr_count($gap->getContent(), "\n") !== 1) {
                continue;
            }

            $next = $tokens[$index + 2] ?? null;

            $isSameIndent = self::indentOf($gap) === $this->braceIndent($tokens, $index);

            if ($next === null || $this->keepsItsPlace($next) || ! $isSameIndent) {
                continue;
            }

            $tokens[$index + 1] = new Token([T_WHITESPACE, "\n".$gap->getContent()]);
        }
    }

    /**
     * Whether the brace is the only code on its line.
     */
    private function standsAlone(Tokens $tokens, int $brace): bool
    {
        $before = $tokens[$brace - 1];

        return $before->isWhitespace() && str_contains($before->getContent(), "\n");
    }

    private function keepsItsPlace(Token $next): bool
    {
        return $next->equalsAny(['}', ')', ']', ';', ',']) || $next->isGivenKind(self::KEEPS_ITS_PLACE);
    }

    private function braceIndent(Tokens $tokens, int $brace): string
    {
        return self::indentOf($tokens[$brace - 1]);
    }

    /**
     * The indentation a whitespace token leaves after its last line break.
     */
    private static function indentOf(Token $whitespace): string
    {
        $content = $whitespace->getContent();

        return substr($content, strrpos($content, "\n") + 1);
    }
}
