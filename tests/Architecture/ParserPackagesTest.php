<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PhpParser\ParserFactory;
use PHPStan\PhpDocParser\Parser\PhpDocParser;
use PHPUnit\Framework\TestCase;
use Tests\Support\TimeLimits\TimeLimit;

#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class ParserPackagesTest extends TestCase
{
    public function test_the_php_parser_reads_a_file(): void
    {
        $statements = (new ParserFactory)->createForNewestSupportedVersion()->parse('<?php echo 1;');

        $this->assertNotEmpty($statements);
    }

    public function test_the_docblock_parser_can_be_loaded(): void
    {
        $this->assertTrue(class_exists(PhpDocParser::class));
    }
}
