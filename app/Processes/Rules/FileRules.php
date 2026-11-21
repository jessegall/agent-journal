<?php

declare(strict_types=1);

namespace App\Processes\Rules;

use App\Processes\Enums\CommandClass;
use App\Processes\Enums\OperandType;
use App\Processes\Values\ArgumentGrammar;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandRule;
use App\Processes\Values\OptionGrammar;
use App\Processes\Values\ProgramSpellings;

/**
 * Programs that change files (doc 21 revision 6, section 6): cp reads and writes, mv also deletes its source, mkdir,
 * touch, chmod, ln, truncate and tee write, rm and rmdir delete, and sed reads or, with -i, edits. An option not listed
 * leaves the command unknown, never a weaker class.
 */
final readonly class FileRules
{
    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        $deleteClasses = CommandClassSet::of(CommandClass::Delete);

        $write = CommandClassSet::of(CommandClass::Write);
        $sedOptions = [
            OptionGrammar::valued(OperandType::Pattern, '-e', '--expression'),
            ...$this->flags('-n', '-E', '-r', '-s', '-u', '-z', '--quiet', '--silent', '--regexp-extended'),
        ];

        return [
            $this->rule(
                'cp',
                $this->paths(),
                CommandClassSet::of(CommandClass::Read, CommandClass::Write),
                '-r',
                '-R',
                '-a',
                '-f',
                '-i',
                '-n',
                '-p',
                '-v',
                '-u',
                '-L',
                '-P',
                '--recursive',
                '--force',
                '--archive',
            ),
            $this->rule(
                'mv',
                $this->paths(),
                CommandClassSet::of(CommandClass::Read, CommandClass::Write, CommandClass::Delete),
                '-f',
                '-i',
                '-n',
                '-v',
                '-u',
                '--force',
            ),
            $this->rule(
                'mkdir',
                $this->paths()->withOptions(OptionGrammar::valued(OperandType::Text, '-m', '--mode')),
                $write,
                '-p',
                '-v',
                '--parents',
            ),
            $this->rule(
                'touch',
                $this->paths()->withOptions(
                    OptionGrammar::valued(OperandType::Text, '-t'),
                    OptionGrammar::valued(OperandType::Text, '-d', '--date'),
                    OptionGrammar::valued(OperandType::Path, '-r', '--reference'),
                ),
                $write,
                '-a',
                '-m',
                '-c',
            ),
            $this->rule(
                'chmod',
                ArgumentGrammar::operands(
                    OperandType::Text,
                    OperandType::Path,
                )->repeating()->endingOptionsAtDoubleDash(),
                $write,
                '-R',
                '-v',
                '-f',
                '--recursive',
            ),
            $this->rule('ln', $this->paths(), $write, '-s', '-f', '-n', '-v', '-r', '-sf', '--symbolic', '--force'),
            $this->rule(
                'truncate',
                $this->paths()->withOptions(OptionGrammar::valued(OperandType::Text, '-s', '--size')),
                $write,
                '-c',
                '--no-create',
            ),
            $this->rule('tee', $this->paths(), $write, '-a', '-i', '--append'),
            $this->rule(
                'rm',
                $this->paths(),
                $deleteClasses,
                '-r',
                '-R',
                '-f',
                '-i',
                '-v',
                '-d',
                '-I',
                '--recursive',
                '--force',
                '--dir',
                '--verbose',
            ),
            $this->rule(
                'rmdir',
                $this->paths(),
                $deleteClasses,
                '-p',
                '-v',
                '--parents',
                '--ignore-fail-on-non-empty',
            ),
            CommandRule::forProgram(
                'core.php.artisan-config-clear',
                new ProgramSpellings('php', ['php8.1', 'php8.2', 'php8.3', 'php8.4', 'php8.5']),
                ['artisan', 'config:clear'],
                ArgumentGrammar::options(['--ansi', '--no-ansi']),
                $deleteClasses,
            ),
            CommandRule::forProgram(
                'core.sed.print',
                new ProgramSpellings('sed'),
                [],
                ArgumentGrammar::operands(
                    OperandType::Pattern,
                    OperandType::Path,
                )->repeating()->endingOptionsAtDoubleDash()->withOptions(...$sedOptions),
                CommandClassSet::of(CommandClass::Read),
            ),
            CommandRule::forProgram(
                'core.sed.in-place',
                new ProgramSpellings('sed'),
                [],
                ArgumentGrammar::optionWithOperands(
                    '-i',
                    OperandType::Pattern,
                    OperandType::Path,
                )->repeating()->endingOptionsAtDoubleDash()->withOptions(...$sedOptions),
                CommandClassSet::of(CommandClass::Read, CommandClass::Edit),
            ),
        ];
    }

    private function rule(
        string $program,
        ArgumentGrammar $arguments,
        CommandClassSet $classes,
        string ...$flags,
    ): CommandRule {
        return CommandRule::forProgram(
            "core.{$program}",
            new ProgramSpellings($program),
            [],
            $arguments->withOptions(...$this->flags(...$flags)),
            $classes,
        );
    }

    private function paths(): ArgumentGrammar
    {
        return ArgumentGrammar::operands(OperandType::Path)->repeating()->endingOptionsAtDoubleDash();
    }

    /**
     * @return list<OptionGrammar>
     */
    private function flags(string ...$names): array
    {
        return array_values(array_map(fn (string $name) => OptionGrammar::flag($name), $names));
    }
}
