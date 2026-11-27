<?php

declare(strict_types=1);

namespace Tests\Unit\CodeStyle;

use PhpCsFixer\Tokenizer\Tokens;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SplFileInfo;
use Tools\CodeStyle\TypedClassConstantFixer;

/**
 * A class constant of one literal declares the type of that literal, and the formatter writes it itself.
 */
final class TypedClassConstantFixerTest extends TestCase
{
    /**
     * @return array<string, array{string, string}>
     */
    public static function samples(): array
    {
        return [
            'literals get their type, a reference and a typed constant stay' => [
                <<<'PHP'
                    <?php
                    class A
                    {
                        private const LIMIT = 3;
                        public const NAME = 'a';
                        const LIST = ['a'];
                        const OTHER = self::LIMIT;
                        public const string DONE = 'd';
                    }

                    PHP,
                <<<'PHP'
                    <?php
                    class A
                    {
                        private const int LIMIT = 3;
                        public const string NAME = 'a';
                        const array LIST = ['a'];
                        const OTHER = self::LIMIT;
                        public const string DONE = 'd';
                    }

                    PHP,
            ],
        ];
    }

    #[DataProvider('samples')]
    public function test_the_fixer_lays_the_sample_out(string $code, string $expected): void
    {
        $tokens = Tokens::fromCode($code);

        new TypedClassConstantFixer()->fix(new SplFileInfo('sample.php'), $tokens);

        $this->assertSame($expected, $tokens->generateCode());
    }
}
