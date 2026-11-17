<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\NameKind;
use Tests\Architecture\Support\NameScan;
use Tests\Architecture\Support\NameUse;
use Tests\Architecture\Support\ParsedFile;
use Tests\Architecture\Support\ParseFailed;

final class NameScanTest extends TestCase
{
    private const string CHAT = 'Tests\Fixtures\Names\Chat';

    /**
     * @return iterable<string, array{string, string, NameKind, int}>
     */
    public static function nameUses(): iterable
    {
        yield 'plain import' => ['PlainImport', 'Message', NameKind::Import, 7];
        yield 'type after a plain import' => ['PlainImport', 'Message', NameKind::Type, 11];
        yield 'static call after a plain import' => ['PlainImport', 'Message', NameKind::StaticAccess, 13];
        yield 'alias import resolves to the class' => ['AliasImport', 'Message', NameKind::Import, 7];
        yield 'alias used as a type' => ['AliasImport', 'Message', NameKind::Type, 11];
        yield 'group import first item' => ['GroupImport', 'ChatFailed', NameKind::Import, 7];
        yield 'group import second item' => ['GroupImport', 'Message', NameKind::Import, 7];
        yield 'parameter type' => ['TypeUses', 'Message', NameKind::Type, 15];
        yield 'nullable property type' => ['TypeUses', 'Message', NameKind::Type, 13];
        yield 'union return type' => ['TypeUses', 'Notifier', NameKind::Type, 15];
        yield 'arrow function type' => ['TypeUses', 'Message', NameKind::Type, 22];
        yield 'class name' => ['ClassNameUse', 'Message', NameKind::ClassName, 13];
        yield 'new' => ['ConstructionUse', 'Message', NameKind::Construction, 16];
        yield 'class constant' => ['StaticUses', 'Message', NameKind::StaticAccess, 14];
        yield 'static call and first class callable' => ['StaticUses', 'Message', NameKind::StaticAccess, 22];
        yield 'use function' => ['FunctionUses', 'send_message', NameKind::Function, 7];
        yield 'imported function call' => ['FunctionUses', 'send_message', NameKind::Function, 13];
        yield 'fully written function call' => ['FunctionUses', 'send_message', NameKind::Function, 14];
        yield 'use const' => ['ConstantUses', 'MAX_LENGTH', NameKind::Constant, 7];
        yield 'constant fetch' => ['ConstantUses', 'MAX_LENGTH', NameKind::Constant, 16];
        yield 'attribute' => ['OtherUses', 'Shared', NameKind::Other, 14];
        yield 'extends' => ['OtherUses', 'Message', NameKind::Other, 15];
        yield 'implements' => ['OtherUses', 'Notifier', NameKind::Other, 15];
        yield 'trait use' => ['OtherUses', 'Escaping', NameKind::Other, 17];
        yield 'insteadof' => ['OtherUses', 'Escaping', NameKind::Other, 18];
        yield 'instanceof' => ['OtherUses', 'Message', NameKind::Other, 24];
        yield 'catch' => ['OtherUses', 'ChatFailed', NameKind::Other, 29];
        yield 'fully written type' => ['FullyWritten', 'Message', NameKind::Type, 9];
        yield 'fully written new' => ['FullyWritten', 'Message', NameKind::Construction, 11];
    }

    #[DataProvider('nameUses')]
    public function test_it_finds_each_form_of_name_use(string $fixture, string $chatName, NameKind $kind, int $line): void
    {
        $file = ParsedFile::fromPath(dirname(__DIR__)."/Fixtures/Names/Plans/{$fixture}.php");

        $this->assertContainsEquals(
            new NameUse($file->path, $line, self::CHAT.'\\'.$chatName, $kind),
            NameScan::of($file),
        );
    }

    public function test_an_anonymous_class_constructs_the_class_it_extends(): void
    {
        $file = ParsedFile::fromPath(dirname(__DIR__).'/Fixtures/Names/Plans/ConstructionUse.php');

        $constructions = array_filter(
            NameScan::of($file),
            fn (NameUse $use) => $use->kind === NameKind::Construction && $use->line === 16,
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
