<?php

declare(strict_types=1);

namespace Tests\Unit\CodeStyle;

use PhpCsFixer\Tokenizer\Tokens;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SplFileInfo;
use Tools\CodeStyle\BlankLineAfterBlockFixer;

/**
 * A statement after a closing brace has a blank line above it, and the formatter puts it there itself.
 */
final class BlankLineAfterBlockFixerTest extends TestCase
{
    /**
     * @return array<string, array{string, string}>
     */
    public static function samples(): array
    {
        return [
            'a statement after an if block, a catch kept by its brace' => [
                <<<'PHP'
                    <?php
                    if ($a) {
                        $b = 1;
                    }
                    $c = 2;
                    try {
                        $d = 3;
                    } catch (E $e) {
                        $f = 4;
                    }

                    PHP,
                <<<'PHP'
                    <?php
                    if ($a) {
                        $b = 1;
                    }

                    $c = 2;
                    try {
                        $d = 3;
                    } catch (E $e) {
                        $f = 4;
                    }

                    PHP,
            ],
            'a closing brace an else or a closing bracket follows keeps its place' => [
                <<<'PHP'
                    <?php
                    if ($a) {
                        $b = 1;
                    }
                    else {
                        $b = 2;
                    }

                    PHP,
                <<<'PHP'
                    <?php
                    if ($a) {
                        $b = 1;
                    }
                    else {
                        $b = 2;
                    }

                    PHP,
            ],
        ];
    }

    #[DataProvider('samples')]
    public function test_the_fixer_lays_the_sample_out(string $code, string $expected): void
    {
        $tokens = Tokens::fromCode($code);

        new BlankLineAfterBlockFixer()->fix(new SplFileInfo('sample.php'), $tokens);

        $this->assertSame($expected, $tokens->generateCode());
    }
}
