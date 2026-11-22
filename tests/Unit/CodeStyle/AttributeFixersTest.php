<?php

declare(strict_types=1);

namespace Tests\Unit\CodeStyle;

use PhpCsFixer\Fixer\FixerInterface;
use PhpCsFixer\Tokenizer\Tokens;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SplFileInfo;
use Tools\CodeStyle\AttributeOrderFixer;
use Tools\CodeStyle\StandaloneAttributeFixer;

/**
 * User messages 9145, 9262 and 15837: the formatter puts an attribute on its own line above a property or promoted
 * parameter, and stacks attributes shortest first.
 */
final class AttributeFixersTest extends TestCase
{
    /**
     * @return array<string, array{FixerInterface, string, string}>
     */
    public static function samples(): array
    {
        return [
            'a longer attribute on top is moved below the shorter one' => [
                new AttributeOrderFixer(),
                <<<'PHP'
                    <?php
                    final class Orders
                    {
                        #[\Deprecated(message: 'a long reason for it')]
                        #[\Override]
                        public function longestFirst(): void {}

                        #[\Override]
                        #[\Deprecated]
                        public function ordered(): void {}
                    }
                    PHP,
                <<<'PHP'
                    <?php
                    final class Orders
                    {
                        #[\Override]
                        #[\Deprecated(message: 'a long reason for it')]
                        public function longestFirst(): void {}

                        #[\Override]
                        #[\Deprecated]
                        public function ordered(): void {}
                    }
                    PHP,
            ],
            'a parameter run is sorted and attributes on one line are left alone' => [
                new AttributeOrderFixer(),
                <<<'PHP'
                    <?php
                    function f(
                        #[SensitiveParameter]
                        #[\Deprecated]
                        string $secret,
                        #[A] #[Longer] int $kept,
                    ): void {}
                    PHP,
                <<<'PHP'
                    <?php
                    function f(
                        #[\Deprecated]
                        #[SensitiveParameter]
                        string $secret,
                        #[A] #[Longer] int $kept,
                    ): void {}
                    PHP,
            ],
            'an attribute in front of a property moves above it' => [
                new StandaloneAttributeFixer(),
                <<<'PHP'
                    <?php
                    final class Placements
                    {
                        #[Hidden] public string $name;

                        #[Hidden]
                        public string $kept;

                        #[\Override] public function method(): void {}
                    }
                    PHP,
                <<<'PHP'
                    <?php
                    final class Placements
                    {
                        #[Hidden]
                        public string $name;

                        #[Hidden]
                        public string $kept;

                        #[\Override] public function method(): void {}
                    }
                    PHP,
            ],
            'an attribute in front of a promoted parameter moves above it, a plain parameter keeps its own' => [
                new StandaloneAttributeFixer(),
                <<<'PHP'
                    <?php
                    final class Promoted
                    {
                        public function __construct(
                            #[Hidden] public readonly string $name,
                            #[SensitiveParameter] string $secret,
                        ) {}
                    }
                    PHP,
                <<<'PHP'
                    <?php
                    final class Promoted
                    {
                        public function __construct(
                            #[Hidden]
                            public readonly string $name,
                            #[SensitiveParameter] string $secret,
                        ) {}
                    }
                    PHP,
            ],
        ];
    }

    #[DataProvider('samples')]
    public function test_the_fixer_rewrites_the_sample(FixerInterface $fixer, string $code, string $expected): void
    {
        $tokens = Tokens::fromCode($code);

        $fixer->fix(new SplFileInfo('sample.php'), $tokens);

        $this->assertSame($expected, $tokens->generateCode());
    }
}
