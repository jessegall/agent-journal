<?php

declare(strict_types=1);

namespace Tests\Unit\CodeStyle;

use PhpCsFixer\Tokenizer\Tokens;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SplFileInfo;
use Tools\CodeStyle\StateSectionsFixer;

/**
 * An agent state's methods sit in the sections, and the formatter places them itself.
 */
final class StateSectionsFixerTest extends TestCase
{
    /**
     * @return array<string, array{string, string}>
     */
    public static function samples(): array
    {
        return [
            'a lifecycle method and an internal one get their sections' => [
                <<<'PHP'
                    <?php
                    final class Waiting extends AgentState
                    {
                        private function wait(): void
                        {
                        }

                        public function onEnter(): void
                        {
                        }
                    }

                    PHP,
                <<<'PHP'
                    <?php
                    final class Waiting extends AgentState
                    {
                        // ----------[ Lifecycle ]----------

                        public function onEnter(): void
                        {
                        }

                        // ----------[ Internals ]----------

                        private function wait(): void
                        {
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

        new StateSectionsFixer()->fix(new SplFileInfo('sample.php'), $tokens);

        $this->assertSame($expected, $tokens->generateCode());
    }
}
