<?php

declare(strict_types=1);

namespace Tests\Unit\CodeStyle;

use PhpCsFixer\Tokenizer\Tokens;
use PHPUnit\Framework\TestCase;
use SplFileInfo;
use Tools\CodeStyle\ModelSectionsFixer;

/**
 * A model's methods are sorted into the marked sections of rule 50, and a model already sorted stays as it is.
 */
final class ModelSectionsFixerTest extends TestCase
{
    private const string MODEL = <<<'PHP'
        <?php
        class Task extends Model
        {
            public function isOpen(): bool
            {
                return true;
            }
        }

        PHP;

    private const string MARKER = '----------[';

    public function test_a_method_outside_a_section_is_placed_under_a_marker_and_a_second_fix_changes_nothing(): void
    {
        $once = $this->fixed(self::MODEL);

        $this->assertStringContainsString(self::MARKER, $once);
        $this->assertLessThan(strpos($once, 'function isOpen'), strpos($once, self::MARKER));
        $this->assertSame($once, $this->fixed($once));
    }

    private function fixed(string $code): string
    {
        $tokens = Tokens::fromCode($code);
        new ModelSectionsFixer()->fix(new SplFileInfo('sample.php'), $tokens);

        return $tokens->generateCode();
    }
}
