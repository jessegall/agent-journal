<?php

declare(strict_types=1);

namespace Tests\Unit\CodeStyle;

use PhpCsFixer\Tokenizer\Tokens;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SplFileInfo;
use Tools\CodeStyle\BlankLineAroundMultilineStatementFixer;

/**
 * User messages 13592 and 15832: a statement of several lines stands apart, and the formatter puts it apart itself.
 */
final class BlankLineAroundMultilineStatementFixerTest extends TestCase
{
    /**
     * @return array<string, array{string, string}>
     */
    public static function samples(): array
    {
        return [
            'an array between one-line assignments, a first one left alone' => [
                <<<'PHP'
                    <?php
                    function card(object $revision): array
                    {
                        $parts = [
                            $revision->title,
                        ];
                        $first = $revision->title;
                        $second = $revision->number;
                        $more = [
                            $first,
                            $second,
                        ];
                        $open = $more;

                        return $open;
                    }
                    PHP,
                <<<'PHP'
                    <?php
                    function card(object $revision): array
                    {
                        $parts = [
                            $revision->title,
                        ];

                        $first = $revision->title;
                        $second = $revision->number;

                        $more = [
                            $first,
                            $second,
                        ];

                        $open = $more;

                        return $open;
                    }
                    PHP,
            ],
            'a closure assigned over several lines after an if block' => [
                <<<'PHP'
                    <?php
                    if ($a) {
                        $b = 1;
                    }
                    $run = function () {
                        $c = 2;
                    };
                    $d = 3;
                    PHP,
                <<<'PHP'
                    <?php
                    if ($a) {
                        $b = 1;
                    }

                    $run = function () {
                        $c = 2;
                    };

                    $d = 3;
                    PHP,
            ],
            'a ternary over several lines keeps its own lines together' => [
                <<<'PHP'
                    <?php
                    $a = 1;
                    $b = $a
                        ? 'yes'
                        : 'no';
                    PHP,
                <<<'PHP'
                    <?php
                    $a = 1;

                    $b = $a
                        ? 'yes'
                        : 'no';
                    PHP,
            ],
            'one-line statements and a multi-line return stay as they are' => [
                <<<'PHP'
                    <?php
                    $a = 1;
                    $b = 2;
                    return [
                        $a,
                    ];
                    PHP,
                <<<'PHP'
                    <?php
                    $a = 1;
                    $b = 2;
                    return [
                        $a,
                    ];
                    PHP,
            ],
        ];
    }

    #[DataProvider('samples')]
    public function test_the_fixer_puts_a_statement_of_several_lines_apart(string $code, string $expected): void
    {
        $tokens = Tokens::fromCode($code);

        new BlankLineAroundMultilineStatementFixer()->fix(new SplFileInfo('sample.php'), $tokens);

        $this->assertSame($expected, $tokens->generateCode());
    }
}
