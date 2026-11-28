<?php

declare(strict_types=1);

namespace Tests\Unit\CodeStyle;

use PhpCsFixer\Tokenizer\Tokens;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use SplFileInfo;
use Tools\CodeStyle\ArrayLinesFixer;

/**
 * Arrays are laid out as rule 111 says, and the formatter lays them out itself.
 */
final class ArrayLinesFixerTest extends TestCase
{
    /**
     * @return array<string, array{string, string}>
     */
    public static function samples(): array
    {
        return [
            'an assigned and a returned array split, an argument that fits joins, a destructuring stays' => [
                <<<'PHP'
                    <?php
                    $colors = ['red', 'green'];
                    [$a, $b] = $pair;
                    show([
                        'red',
                        'green',
                    ]);
                    return ['a', 'b'];

                    PHP,
                <<<'PHP'
                    <?php
                    $colors = [
                        'red',
                        'green',
                    ];
                    [$a, $b] = $pair;
                    show(['red', 'green']);
                    return [
                        'a',
                        'b',
                    ];

                    PHP,
            ],
        ];
    }

    #[DataProvider('samples')]
    public function test_the_fixer_lays_the_sample_out(string $code, string $expected): void
    {
        $tokens = Tokens::fromCode($code);

        new ArrayLinesFixer()->fix(new SplFileInfo('sample.php'), $tokens);

        $this->assertSame($expected, $tokens->generateCode());
    }

    public function test_it_preserves_multiline_string_contents_and_trailing_comments(): void
    {
        $code = <<<'PHP'
            <?php
            $message = ['first line
            second line', 'another short entry'];
            $colors = ['red', 'green' /* reason for green */];
            PHP;
        $tokens = Tokens::fromCode($code);

        new ArrayLinesFixer()->fix(new SplFileInfo('sample.php'), $tokens);

        $this->assertSame($code, $tokens->generateCode());
    }
}
