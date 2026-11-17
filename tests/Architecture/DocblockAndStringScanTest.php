<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\DocblockScan;
use Tests\Architecture\Support\DocblockTagInvalid;
use Tests\Architecture\Support\NameKind;
use Tests\Architecture\Support\NameUse;
use Tests\Architecture\Support\ParsedFile;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\StringScan;

final class DocblockAndStringScanTest extends TestCase
{
    private const string CHAT = 'Tests\Fixtures\Names\Chat';

    /**
     * @return iterable<string, array{string, int}>
     */
    public static function docblockTypes(): iterable
    {
        yield 'template of' => ['Message', 14];
        yield 'property' => ['Notifier', 16];
        yield 'method' => ['Message', 18];
        yield 'generic var' => ['Message', 23];
        yield 'array shape param' => ['Message', 28];
        yield 'union return' => ['Notifier', 29];
        yield 'throws' => ['ChatFailed', 31];
        yield 'inline var before a statement' => ['Message', 43];
        yield 'fully written return' => ['Message', 50];
    }

    #[DataProvider('docblockTypes')]
    public function test_it_finds_each_docblock_type(string $chatName, int $line): void
    {
        $file = $this->fixture('DocblockTypes');

        $this->assertContainsEquals(
            new NameUse($file->path, $line, self::CHAT.'\\'.$chatName, NameKind::Type),
            DocblockScan::of($file),
        );
    }

    public function test_built_in_docblock_types_are_no_names(): void
    {
        $names = array_map(fn (NameUse $use) => $use->name, DocblockScan::of($this->fixture('DocblockTypes')));

        $this->assertNotContains('Tests\Fixtures\Names\Plans\int', $names);
        $this->assertNotContains('Tests\Fixtures\Names\Plans\list', $names);
    }

    public function test_a_docblock_tag_that_cannot_be_parsed_is_named(): void
    {
        $path = sys_get_temp_dir().'/'.uniqid('docblock_', true).'.php';
        file_put_contents($path, "<?php\n\n/**\n * @param  array<\n */\nfunction broken(array \$values): void {}\n");

        try {
            $this->expectExceptionObject(DocblockTagInvalid::for($path, 4, '@param'));

            DocblockScan::of(ParsedFile::fromPath($path));
        } finally {
            unlink($path);
        }
    }

    /**
     * @return iterable<string, array{string, int}>
     */
    public static function stringNames(): iterable
    {
        yield 'heredoc' => [self::CHAT.'\Message', 14];
        yield 'literal' => [self::CHAT.'\Message', 19];
        yield 'literal with a leading backslash' => [self::CHAT.'\Message', 20];
        yield 'concatenation' => [self::CHAT.'\\', 21];
        yield 'concatenation with a leading backslash' => [self::CHAT.'\\', 22];
        yield 'interpolation' => [self::CHAT.'\\', 23];
        yield 'interpolation with a leading backslash' => [self::CHAT.'\\', 24];
        yield 'app() with a class name' => [self::CHAT.'\Message', 32];
        yield 'resolve() with a class name' => [self::CHAT.'\Message', 34];
    }

    #[DataProvider('stringNames')]
    public function test_it_finds_each_string_that_names_project_code(string $name, int $line): void
    {
        $file = $this->fixture('StringNames');

        $this->assertContainsEquals(
            new NameUse($file->path, $line, $name, NameKind::String),
            StringScan::of($file, $this->roots()),
        );
    }

    public function test_a_sentence_is_no_name(): void
    {
        $names = array_map(fn (NameUse $use) => $use->name, StringScan::of($this->fixture('StringNames'), $this->roots()));

        $this->assertNotContains('your tasks are done', $names);
        $this->assertCount(9, $names);
    }

    public function test_the_project_roots_come_from_composer(): void
    {
        $this->assertSame(['App\\', 'Database\\Factories\\', 'Database\\Seeders\\', 'Tests\\'], $this->roots()->namespaces);
    }

    private function fixture(string $name): ParsedFile
    {
        return ParsedFile::fromPath(dirname(__DIR__)."/Fixtures/Names/Plans/{$name}.php");
    }

    private function roots(): ProjectRoots
    {
        return ProjectRoots::fromComposer(dirname(__DIR__, 2).'/composer.json');
    }
}
