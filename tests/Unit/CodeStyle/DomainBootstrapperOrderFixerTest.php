<?php

declare(strict_types=1);

namespace Tests\Unit\CodeStyle;

use PhpCsFixer\Tokenizer\Tokens;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SplFileInfo;
use Tools\CodeStyle\DomainBootstrapperOrderFixer;

/**
 * A domain's bootstrappers() is moved right below its description(), and the formatter moves it itself.
 */
final class DomainBootstrapperOrderFixerTest extends TestCase
{
    /**
     * @return array<string, array{string, string}>
     */
    public static function samples(): array
    {
        return [
            'bootstrappers below another method moves up' => [
                <<<'PHP'
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

                    PHP,
                <<<'PHP'
                    <?php
                    class A
                    {
                        public function description(): string
                        {
                            return 'a';
                        }

                        public function bootstrappers(): array
                        {
                            return [];
                        }

                        public function pages(): array
                        {
                            return [];
                        }
                    }

                    PHP,
            ],
        ];
    }

    #[DataProvider('samples')]
    public function test_the_fixer_lays_the_sample_out(string $code, string $expected): void
    {
        $tokens = Tokens::fromCode($code);

        new DomainBootstrapperOrderFixer()->fix(new SplFileInfo('sample.php'), $tokens);

        $this->assertSame($expected, $tokens->generateCode());
    }
}
