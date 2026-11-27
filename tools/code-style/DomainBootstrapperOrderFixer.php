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
 * A domain that adds boot steps of its own says what it is and what its boot runs first: bootstrappers() is moved
 * to the place right below description() (rule 35), with its docblock and attributes.
 */
final class DomainBootstrapperOrderFixer implements FixerInterface
{
    public function getName(): string
    {
        return 'Journal/domain_bootstrapper_order';
    }

    public function getDefinition(): FixerDefinitionInterface
    {
        return new FixerDefinition(
            'In a class that declares both, bootstrappers() is the method right below description().',
            [new CodeSample(<<<'PHP'
                <?php
                class A
                {
                    public function description(): string
                    {
                        return 'a';
                    }

                    public function pages(): array
                    {
                        return [];
                    }

                    public function bootstrappers(): array
                    {
                        return [];
                    }
                }

                PHP)],
        );
    }

    public function isCandidate(Tokens $tokens): bool
    {
        return $tokens->isTokenKindFound(T_FUNCTION) && str_contains($tokens->generateCode(), 'function bootstrappers');
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
        return new ProjectFolders(['domain', 'tests/Fixtures/Modules'])->holds($file);
    }

    public function fix(SplFileInfo $file, Tokens $tokens): void
    {
        foreach (array_reverse(MethodSpans::classBodies($tokens)) as $body) {
            $spans = MethodSpans::of($tokens, $body);

            if (! isset($spans['description'], $spans['bootstrappers'])) {
                continue;
            }

            $names = array_keys($spans);

            if (($names[array_search('description', $names, true) + 1] ?? null) === 'bootstrappers') {
                continue;
            }

            $this->moveBelow($tokens, $spans['bootstrappers'], $spans['description']);
        }
    }

    /**
     * Moves the method's tokens, with the blank line before them, to just after the other method.
     *
     * @param  array{int, int}  $moved
     * @param  array{int, int}  $above
     */
    private function moveBelow(Tokens $tokens, array $moved, array $above): void
    {
        [$start, $end] = $moved;
        $method = [];

        for ($index = $start; $index <= $end; $index++) {
            $method[] = clone $tokens[$index];
        }

        $gap = $tokens[$start - 1];
        $separator = new Token([T_WHITESPACE, $gap->isWhitespace() ? $gap->getContent() : "\n\n    "]);
        $tokens->clearRange($gap->isWhitespace() ? $start - 1 : $start, $end);
        $tokens->insertAt($above[1] + 1, [$separator, ...$method]);
        $tokens->clearEmptyTokens();
    }
}
