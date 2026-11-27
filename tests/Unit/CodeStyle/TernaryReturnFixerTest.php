<?php

declare(strict_types=1);

namespace Tests\Unit\CodeStyle;

use PhpCsFixer\Tokenizer\Tokens;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SplFileInfo;
use Tools\CodeStyle\TernaryReturnFixer;

/**
 * A return of a ternary becomes an if with an early return, and the formatter rewrites it itself.
 */
final class TernaryReturnFixerTest extends TestCase
{
    /**
     * @return array<string, array{string, string}>
     */
    public static function samples(): array
    {
        return [
            'a ternary return becomes an if and a return' => [
                <<<'PHP'
                    <?php
                    function a(bool $b): int
                    {
                        return $b ? 1 : 2;
                    }

                    PHP,
                <<<'PHP'
                    <?php
                    function a(bool $b): int
                    {
                        if ($b) {
                            return 1;
                        }

                        return 2;
                    }

                    PHP,
            ],
            'a short ternary and a closure stay' => [
                <<<'PHP'
                    <?php
                    function a(int $b): mixed
                    {
                        return $b ?: 2;
                    }
                    function c(bool $d): mixed
                    {
                        return fn () => $d ? 1 : 2;
                    }

                    PHP,
                <<<'PHP'
                    <?php
                    function a(int $b): mixed
                    {
                        return $b ?: 2;
                    }
                    function c(bool $d): mixed
                    {
                        return fn () => $d ? 1 : 2;
                    }

                    PHP,
            ],
        ];
    }

    #[DataProvider('samples')]
    public function test_the_fixer_lays_the_sample_out(string $code, string $expected): void
    {
        $tokens = Tokens::fromCode($code);

        new TernaryReturnFixer()->fix(new SplFileInfo('sample.php'), $tokens);

        $this->assertSame($expected, $tokens->generateCode());
    }
}
