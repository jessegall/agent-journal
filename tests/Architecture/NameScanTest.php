<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\NameScan;
use Tests\Architecture\Support\NameType;
use Tests\Architecture\Support\NameUse;
use Tests\Architecture\Support\ParsedFile;
use Tests\Architecture\Support\ParseFailed;
use Tests\Support\TimeLimits\TimeLimit;

#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class NameScanTest extends TestCase
{
    private const string CHAT = 'Tests\Fixtures\Names\Chat';

    /**
     * @return iterable<string, array{string, string, NameType, int}>
     */
    public static function nameUses(): iterable
    {
        yield 'plain import' => ['PlainImport', 'Message', NameType::Import, 7];
        yield 'type after a plain import' => ['PlainImport', 'Message', NameType::Type, 11];
        yield 'static call after a plain import' => ['PlainImport', 'Message', NameType::StaticAccess, 13];
        yield 'alias import resolves to the class' => ['AliasImport', 'Message', NameType::Import, 7];
        yield 'alias used as a type' => ['AliasImport', 'Message', NameType::Type, 11];
        yield 'group import first item' => ['GroupImport', 'ChatFailed', NameType::Import, 7];
        yield 'group import second item' => ['GroupImport', 'Message', NameType::Import, 7];
        yield 'parameter type' => ['TypeUses', 'Message', NameType::Type, 15];
        yield 'nullable property type' => ['TypeUses', 'Message', NameType::Type, 13];
        yield 'union return type' => ['TypeUses', 'Notifier', NameType::Type, 15];
        yield 'arrow function type' => ['TypeUses', 'Message', NameType::Type, 22];
        yield 'class name' => ['ClassNameUse', 'Message', NameType::ClassName, 13];
        yield 'new' => ['ConstructionUse', 'Message', NameType::Construction, 16];
        yield 'class constant' => ['StaticUses', 'Message', NameType::StaticAccess, 14];
        yield 'static call and first class callable' => ['StaticUses', 'Message', NameType::StaticAccess, 22];
        yield 'use function' => ['FunctionUses', 'send_message', NameType::Function, 7];
        yield 'imported function call' => ['FunctionUses', 'send_message', NameType::Function, 13];
        yield 'fully written function call' => ['FunctionUses', 'send_message', NameType::Function, 14];
        yield 'use const' => ['ConstantUses', 'MAX_LENGTH', NameType::Constant, 7];
        yield 'constant fetch' => ['ConstantUses', 'MAX_LENGTH', NameType::Constant, 16];
        yield 'attribute' => ['OtherUses', 'Shared', NameType::Other, 14];
        yield 'extends' => ['OtherUses', 'Message', NameType::Other, 15];
        yield 'implements' => ['OtherUses', 'Notifier', NameType::Other, 15];
        yield 'trait use' => ['OtherUses', 'Escaping', NameType::Other, 17];
        yield 'insteadof' => ['OtherUses', 'Escaping', NameType::Other, 18];
        yield 'instanceof' => ['OtherUses', 'Message', NameType::Other, 24];
        yield 'catch' => ['OtherUses', 'ChatFailed', NameType::Other, 29];
        yield 'fully written type' => ['FullyWritten', 'Message', NameType::Type, 9];
        yield 'fully written new' => ['FullyWritten', 'Message', NameType::Construction, 11];
    }

    #[DataProvider('nameUses')]
    public function test_it_finds_each_form_of_name_use(string $fixture, string $chatName, NameType $type, int $line): void
    {
        $file = ParsedFile::fromPath(dirname(__DIR__)."/Fixtures/Names/Plans/{$fixture}.php");

        $this->assertContainsEquals(
            new NameUse($file->path, $line, self::CHAT.'\\'.$chatName, $type),
            NameScan::of($file),
        );
    }

    public function test_an_anonymous_class_constructs_the_class_it_extends(): void
    {
        $file = ParsedFile::fromPath(dirname(__DIR__).'/Fixtures/Names/Plans/ConstructionUse.php');

        $constructions = array_filter(
            NameScan::of($file),
            fn (NameUse $use) => $use->type === NameType::Construction && $use->line === 16,
        );

        $this->assertCount(2, $constructions);
    }

    public function test_a_file_that_cannot_be_parsed_is_named(): void
    {
        $path = sys_get_temp_dir().'/'.uniqid('broken_', true).'.php';
        file_put_contents($path, '<?php final class {');

        try {
            $this->expectException(ParseFailed::class);
            $this->expectExceptionMessage("{$path} could not be parsed");

            ParsedFile::fromPath($path);
        } finally {
            unlink($path);
        }
    }
}
