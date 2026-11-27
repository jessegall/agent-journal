<?php

declare(strict_types=1);

namespace Tools\CodeStyle;

use PhpCsFixer\Fixer\FixerInterface;
use PhpCsFixer\FixerDefinition\CodeSample;
use PhpCsFixer\FixerDefinition\FixerDefinition;
use PhpCsFixer\FixerDefinition\FixerDefinitionInterface;
use PhpCsFixer\Tokenizer\CT;
use PhpCsFixer\Tokenizer\Tokens;
use SplFileInfo;

/**
 * Arrays are laid out as rule 111 says, by ArrayLayout: split one entry a line when returned, assigned or too wide,
 * and kept on one line, or joined, when they are an argument that fits.
 */
final class ArrayLinesFixer implements FixerInterface
{
    public function getName(): string
    {
        return 'Journal/array_lines';
    }

    public function getDefinition(): FixerDefinitionInterface
    {
        return new FixerDefinition(
            'An array is split one entry a line unless it is an argument that fits its line, which is joined.',
            [new CodeSample("<?php\n\$colors = ['red', 'green'];\nshow([\n    'red',\n    'green',\n]);\n")],
        );
    }

    public function isCandidate(Tokens $tokens): bool
    {
        return $tokens->isTokenKindFound(CT::T_ARRAY_SQUARE_BRACE_OPEN);
    }

    public function isRisky(): bool
    {
        return false;
    }

    public function getPriority(): int
    {
        // Before the blank line fixer, which then sees how many lines each statement takes.
        return 20;
    }

    public function supports(SplFileInfo $file): bool
    {
        return new ProjectFolders(['app', 'domain', 'tools'])->holds($file);
    }

    public function fix(SplFileInfo $file, Tokens $tokens): void
    {
        $source = $tokens->generateCode();
        $laidOut = new ArrayLayout()->laidOut($source);

        if ($laidOut !== $source) {
            $tokens->setCode($laidOut);
        }
    }
}
