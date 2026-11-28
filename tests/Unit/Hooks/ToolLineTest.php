<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Agents\Enums\AccessType;
use App\Agents\Inputs\Values\FileChange;
use App\Agents\Inputs\Values\FileChanges;
use App\Files\Enums\FileOperation;
use App\Values\Operation;
use App\Values\ResourceRequest;
use App\Values\ShownShellLine;
use App\Values\ToolLine;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Each tool call the chat line names reads as version 5 wrote it: the tool and its subject, secrets masked, long paths
 * cut to their file name, and the whole held to the line's limit.
 */
final class ToolLineTest extends TestCase
{
    #[DataProvider('lines')]
    public function test_each_tool_call_reads_as_version_5_wrote_it(ToolLine $line, string $text): void
    {
        $this->assertSame($text, $line->text);
    }

    /**
     * @return iterable<string, array{ToolLine, string}>
     */
    public static function lines(): iterable
    {
        yield 'a shell command' => [ToolLine::shell('npm test'), 'Bash npm test'];

        yield 'a rewritten command' => [ToolLine::rewritten('journal run npm test'), 'Bash journal run npm test'];

        yield 'a command with a secret' => [
            ToolLine::shell('curl --token=abc https://x.test'),
            'Bash curl with a private value',
        ];

        yield 'a long path in a command' => [ToolLine::shell('cat /Users/x/p/src/Pages.php'), 'Bash cat …/Pages.php'];

        yield 'an address in a command' => [
            ToolLine::shell('curl https://example.test/a/b/c'),
            'Bash curl https://example.test/a/b/c',
        ];

        yield 'a file read' => [self::operation('claude:Read', '/Users/x/p/src/Chat/Pages.php'), 'Read …/Pages.php'];

        yield 'a search' => [self::operation('claude:Grep', 'src'), 'Grep src'];

        yield 'a fetch' => [
            self::operation('claude:WebFetch', 'https://example.test/docs'),
            'WebFetch https://example.test/docs',
        ];

        yield 'an edit of one file' => [
            ToolLine::files(new FileChanges([new FileChange('/Users/x/p/a.php', FileOperation::Edit)])),
            'Edit …/a.php',
        ];

        yield 'a patch of two files' => [
            ToolLine::files(new FileChanges([
                new FileChange('src/a.php', FileOperation::Edit),
                new FileChange('src/b.php', FileOperation::Create),
            ])),
            'Edit src/a.php, src/b.php',
        ];
    }

    public function test_a_long_line_is_cut_to_the_limit(): void
    {
        $line = ToolLine::shell('echo '.str_repeat('a', 300));

        $this->assertSame(ToolLine::TEXT_CHARACTER_LIMIT, mb_strlen($line->text));
    }

    public function test_the_shown_shell_line_masks_a_secret_and_keeps_any_other_line(): void
    {
        $this->assertSame(
            ['gh with a private value', 'git status'],
            [ShownShellLine::of('gh auth login --with-token secret'), ShownShellLine::of('git status')],
        );
    }

    private static function operation(string $name, string $target): ToolLine
    {
        return ToolLine::operation(
            new Operation('claude', $name, [AccessType::Read], [ResourceRequest::path($target)], [], 1),
        );
    }
}
