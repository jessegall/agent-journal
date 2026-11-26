<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Agents\Values\CommandPart;
use App\CommandRules\Enums\CommandEffect;
use App\CommandRules\Enums\CommandType;
use App\CommandRules\Enums\ParseOutcome;
use App\Processes\Enums\PartJoin;
use App\Processes\Enums\ShellDialect;
use App\Values\ShellCommand;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * A shell line says what running it does: it only reads, or it changes files or could. One is never both.
 */
final class ShellCommandTest extends TestCase
{
    /**
     * @return iterable<string, array{ShellCommand, bool}>
     */
    public static function lines(): iterable
    {
        yield 'a line read whole whose parts only read' => [
            self::line(ParseOutcome::Complete, CommandEffect::ReadsOnly, CommandEffect::ReadsOnly),
            true,
        ];

        yield 'a line with one part that changes files' => [
            self::line(ParseOutcome::Complete, CommandEffect::ReadsOnly, CommandEffect::ChangesFiles),
            false,
        ];

        yield 'a line with a part whose effect is unknown' => [
            self::line(ParseOutcome::Complete, CommandEffect::Unknown),
            false,
        ];

        yield 'a line the parser could not read' => [self::line(ParseOutcome::Unparsed), false];
    }

    #[DataProvider('lines')]
    public function test_a_line_reads_only_exactly_when_it_does_not_change_files(ShellCommand $line, bool $readsOnly): void
    {
        $this->assertSame($readsOnly, $line->readsOnly());
        $this->assertSame(! $readsOnly, $line->changesFiles());
    }

    private static function line(ParseOutcome $outcome, CommandEffect ...$effects): ShellCommand
    {
        return new ShellCommand('the line', ShellDialect::Bash, $outcome, array_map(
            fn (CommandEffect $effect) => new CommandPart('driver', [], $effect, CommandType::Ordinary, PartJoin::End),
            array_values($effects),
        ));
    }
}
