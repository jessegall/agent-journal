<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\FormerPaths;
use Tests\Architecture\Support\WordLines;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Task 2196: Claude Code, Codex and the like are drivers, so no name or text calls one a program. Program keeps its
 * own meaning only where it is an operating-system executable: the command classifier (Processes and Shell), the
 * sharing gateways' binaries, a shell part's program and the sign-in executable.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every line of the code it judges.')]
final class DriverWordTest extends TestCase
{
    private const string HOW_TO_FIX = 'Say driver, not program, for Claude Code, Codex and the like.';

    private const string HOW_TO_FIX_IN_GO = 'Say driver, not program, for Claude Code and Codex in the Go host.';

    private const string GO_PROGRAM_CALL = 'name := profile.Program()';

    private const string GO_PROGRAM_COMMENT = '// Package profiles holds each agent program.';

    private const string GO_EXECUTABLE_CALL = 'program, err := os.Executable()';

    /**
     * Folders and files where program means an operating-system executable; a moved file counts by its former path.
     */
    private const array EXECUTABLE_SENSE = [
        'app/Processes/',
        'app/Shell/',
        'app/Sharing/',
        'app/Enums/PlaceExemption.php',
        'app/Support/ShellOperations.php',
        'app/Exceptions/SignInProtocolMissing.php',
    ];

    /**
     * Lines elsewhere that name the command classifier's program types or a driver's executable path setting; a line
     * naming a class that was in app/Processes is kept too.
     */
    private const string EXECUTABLE_LINE = '/Program(Classifier|Spellings|Identity)::class|accounts\\.(claude|codex)_program/';

    public function test_no_code_calls_a_driver_a_program(): void
    {
        $folders = [
            app_path(),
            ...DomainFiles::domainCode(),
            resource_path('js'),
            ...(glob(base_path('domain/*/resources/js'), GLOB_ONLYDIR) ?: []),
        ];

        $found = array_values(array_filter(
            WordLines::in(WordLines::DRIVER_WORDS, $folders),
            fn (string $line): bool => ! FormerPaths::wasIn(self::relativePath($line), self::EXECUTABLE_SENSE)
                && preg_match(self::EXECUTABLE_LINE, self::text($line)) !== 1
                && ! self::namesAProcessesClass(self::text($line)),
        ));

        $this->assertSame([], $found, self::HOW_TO_FIX);
    }

    public function test_the_go_host_calls_a_driver_a_driver(): void
    {
        $found = WordLines::in(WordLines::GO_DRIVER_WORDS, [base_path('tools/journal-agent')]);

        $this->assertSame([], $found, self::HOW_TO_FIX_IN_GO);
    }

    public function test_the_go_check_catches_a_driver_called_a_program(): void
    {
        $this->assertMatchesRegularExpression(WordLines::GO_DRIVER_WORDS, self::GO_PROGRAM_CALL);
        $this->assertMatchesRegularExpression(WordLines::GO_DRIVER_WORDS, self::GO_PROGRAM_COMMENT);
        $this->assertDoesNotMatchRegularExpression(WordLines::GO_DRIVER_WORDS, self::GO_EXECUTABLE_CALL);
    }

    /**
     * The text of the line a `path:line` names.
     */
    private static function relativePath(string $line): string
    {
        return substr(explode(':', $line)[0], strlen(base_path()) + 1);
    }

    /**
     * Whether the line names an App class whose file was in app/Processes before plan 62 moved it.
     */
    private static function namesAProcessesClass(string $text): bool
    {
        preg_match_all('/App\\\\[A-Za-z\\\\]+/', $text, $names);

        return array_any($names[0], fn (string $name) => FormerPaths::classWasIn($name, ['app/Processes/']));
    }

    private static function text(string $line): string
    {
        [$path, $number] = explode(':', $line);

        return (file($path, FILE_IGNORE_NEW_LINES) ?: [])[(int) $number - 1] ?? '';
    }
}
