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
 * Programs that only read (doc 21 revision 6, section 6, baseline families): cat, head, tail, ls, pwd, wc, stat, file,
 * echo, printf, grep, rg, diff, which and tree, each with the options it is known to take.
 */
final readonly class ReadingRules
{
    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        $read = CommandClassSet::of(CommandClass::Read);

        return [
            $this->reader(
                'cat',
                $this->paths()->withOptions(...$this->flags('-n', '-b', '-A', '-e', '-s', '-v', '-E', '-T')),
                $read,
            ),
            $this->reader(
                'head',
                $this->paths()->acceptingNumericOptions()->withOptions(OptionGrammar::valued(OperandType::Count, '-n', '--lines'), OptionGrammar::valued(OperandType::Count, '-c', '--bytes'), ...$this->flags('-q', '-v')),
                $read,
            ),
            $this->reader(
                'tail',
                $this->paths()->acceptingNumericOptions()->withOptions(OptionGrammar::valued(OperandType::Count, '-n', '--lines'), OptionGrammar::valued(OperandType::Count, '-c', '--bytes'), ...$this->flags('-f', '-F', '--follow', '-q', '-v')),
                $read,
            ),
            $this->reader(
                'ls',
                $this->paths()->withOptions(OptionGrammar::valued(OperandType::Text, '--color'), ...$this->flags('-l', '-a', '-A', '-h', '-R', '-t', '-r', '-S', '-1', '-d', '-F', '-G', '-i', '-s', '--all', '--human-readable')),
                $read,
            ),
            $this->reader('pwd', ArgumentGrammar::options(['-L', '-P']), $read),
            $this->reader('wc', $this->paths()->withOptions(...$this->flags('-l', '-w', '-c', '-m', '-L')), $read),
            $this->reader(
                'stat',
                $this->paths()->withOptions(OptionGrammar::valued(OperandType::Text, '-c', '--format'), OptionGrammar::valued(OperandType::Text, '-f'), ...$this->flags('-L', '-x')),
                $read,
            ),
            $this->reader('file', $this->paths()->withOptions(...$this->flags('-b', '-i', '-L', '--mime-type')), $read),
            $this->reader(
                'echo',
                ArgumentGrammar::operands(OperandType::Text)->repeating()->withOptions(...$this->flags('-n', '-e', '-E')),
                CommandClassSet::empty(),
            ),
            $this->reader(
                'printf',
                ArgumentGrammar::operands(OperandType::Text)->repeating(),
                CommandClassSet::empty(),
            ),
            $this->reader('grep', ArgumentGrammar::operands(
                OperandType::Pattern,
                OperandType::Path,
            )->repeating()->endingOptionsAtDoubleDash()->withOptions(
                OptionGrammar::valued(
                    OperandType::Pattern,
                    '-e',
                    '--regexp',
                ), OptionGrammar::valued(OperandType::Count, '-A'), OptionGrammar::valued(OperandType::Count, '-B'), OptionGrammar::valued(OperandType::Count, '-C'),
                OptionGrammar::valued(
                    OperandType::Count,
                    '-m',
                    '--max-count',
                ), OptionGrammar::valued(OperandType::Pattern, '--include'), OptionGrammar::valued(OperandType::Pattern, '--exclude'), OptionGrammar::valued(OperandType::Pattern, '--exclude-dir'), OptionGrammar::valued(OperandType::Text, '--color'),
                ...$this->flags(
                    '-r',
                    '-R',
                    '-n',
                    '-i',
                    '-v',
                    '-l',
                    '-L',
                    '-c',
                    '-w',
                    '-x',
                    '-E',
                    '-F',
                    '-P',
                    '-o',
                    '-q',
                    '-s',
                    '-h',
                    '-H',
                    '-I',
                    '-a',
                    '-z',
                    '--recursive',
                    '--line-number',
                    '--ignore-case',
                    '--files-with-matches',
                    '--count',
                    '--fixed-strings',
                    '--extended-regexp',
                    '--only-matching',
                    '--quiet',
                ),
            ), $read),
            $this->reader('rg', ArgumentGrammar::operands(
                OperandType::Pattern,
                OperandType::Path,
            )->repeating()->endingOptionsAtDoubleDash()->withOptions(
                OptionGrammar::valued(OperandType::Pattern, '-g', '--glob'), OptionGrammar::valued(OperandType::Name, '-t', '--type'), OptionGrammar::valued(
                    OperandType::Name,
                    '-T',
                    '--type-not',
                ),
                OptionGrammar::valued(OperandType::Count, '-A', '--after-context'), OptionGrammar::valued(
                    OperandType::Count,
                    '-B',
                    '--before-context',
                ), OptionGrammar::valued(OperandType::Count, '-C', '--context'),
                OptionGrammar::valued(OperandType::Pattern, '-e', '--regexp'), OptionGrammar::valued(OperandType::Count, '-m', '--max-count'), OptionGrammar::valued(OperandType::Count, '-d', '--max-depth'), OptionGrammar::valued(
                    OperandType::Count,
                    '-M',
                    '--max-columns',
                ),
                ...$this->flags(
                    '-n',
                    '-N',
                    '-i',
                    '-l',
                    '-c',
                    '-w',
                    '-F',
                    '-S',
                    '-s',
                    '-u',
                    '-v',
                    '-o',
                    '-U',
                    '-L',
                    '-a',
                    '-z',
                    '--hidden',
                    '--no-ignore',
                    '--files',
                    '--json',
                    '--line-number',
                    '--no-heading',
                    '--heading',
                    '--multiline',
                    '--fixed-strings',
                    '--ignore-case',
                    '--smart-case',
                    '--files-with-matches',
                    '--count',
                    '--vimgrep',
                    '--sort-files',
                ),
            ), $read),
            $this->reader(
                'diff',
                $this->paths()->withOptions(OptionGrammar::valued(OperandType::Count, '-U', '--unified'), ...$this->flags('-u', '-r', '-N', '-q', '-w', '-b', '-i', '-y', '--brief', '--recursive')),
                $read,
            ),
            $this->reader(
                'which',
                ArgumentGrammar::operands(OperandType::Name)->repeating()->withOptions(...$this->flags('-a', '-s')),
                $read,
            ),
            $this->reader(
                'date',
                ArgumentGrammar::operands(OperandType::Text)->withOptions(OptionGrammar::valued(OperandType::Text, '-d', '--date'), OptionGrammar::valued(OperandType::Path, '-r', '--reference'), ...$this->flags('-u', '-R', '-I', '--utc', '--iso-8601', '--rfc-2822')),
                $read,
            ),
            $this->reader(
                'ps',
                ArgumentGrammar::operands(OperandType::Text)->repeating()->withOptions(OptionGrammar::valued(OperandType::Text, '-o', '-p', '-u', '-U', '-C', '--pid', '--ppid', '--sort'), ...$this->flags('-e', '-f', '-A', '-a', '-x', '-l', '-w', '-ww', '-ef', '-eo', '-ax', '--forest', '--no-headers')),
                $read,
            ),
            $this->reader(
                'pgrep',
                ArgumentGrammar::operands(OperandType::Pattern)->withOptions(OptionGrammar::valued(OperandType::Text, '-u', '-P', '-g'), ...$this->flags('-f', '-l', '-a', '-x', '-n', '-o', '-c', '-i', '-fl', '-af')),
                $read,
            ),
            $this->reader(
                'lsof',
                ArgumentGrammar::operands(OperandType::Path)->repeating()->withOptions(OptionGrammar::valued(OperandType::Text, '-i', '-p', '-c', '-u', '-s'), ...$this->flags('-n', '-P', '-t', '-a', '-nP', '-iTCP', '-sTCP:LISTEN')),
                $read,
            ),
            $this->reader(
                'cut',
                $this->paths()->withOptions(OptionGrammar::valued(OperandType::Text, '-d', '-f', '-c', '-b', '--delimiter', '--fields', '--characters'), ...$this->flags('-s', '--complement', '--only-delimited')),
                $read,
            ),
            $this->reader(
                'sort',
                $this->paths()->withOptions(OptionGrammar::valued(OperandType::Text, '-k', '-t', '--key', '--field-separator'), ...$this->flags('-n', '-r', '-u', '-h', '-V', '-f', '-b', '-g', '-s', '-rn', '-nr', '-hr', '--numeric-sort', '--reverse', '--unique', '--human-numeric-sort', '--version-sort')),
                $read,
            ),
            $this->reader(
                'tr',
                ArgumentGrammar::operands(OperandType::Text)->repeating()->withOptions(...$this->flags('-d', '-s', '-c', '-cd', '-ds', '--delete', '--squeeze-repeats')),
                $read,
            ),
            $this->reader(
                'du',
                $this->paths()->withOptions(OptionGrammar::valued(OperandType::Count, '-d', '--max-depth'), ...$this->flags('-s', '-h', '-a', '-c', '-k', '-m', '-x', '-sh', '-hs', '-sk', '--summarize', '--human-readable')),
                $read,
            ),
            $this->reader(
                'jq',
                ArgumentGrammar::operands(OperandType::Pattern, OperandType::Path)->repeating()->withOptions(...$this->flags('-r', '-c', '-e', '-s', '-n', '-S', '-j', '-M', '-C', '-rc', '--raw-output', '--compact-output', '--slurp', '--sort-keys')),
                $read,
            ),
            $this->reader('sleep', ArgumentGrammar::operands(OperandType::Text)->repeating(), CommandClassSet::empty()),
            $this->reader('true', ArgumentGrammar::operands(OperandType::Text)->repeating(), CommandClassSet::empty()),
            $this->reader('false', ArgumentGrammar::operands(OperandType::Text)->repeating(), CommandClassSet::empty()),
            CommandRule::forProgram(
                'core.colon',
                new ProgramSpellings(':'),
                [],
                ArgumentGrammar::operands(OperandType::Text)->repeating(),
                CommandClassSet::empty(),
            ),
            $this->reader(
                'unset',
                ArgumentGrammar::operands(OperandType::Name)->repeating()->withOptions(...$this->flags('-v', '-f')),
                CommandClassSet::empty(),
            ),
            $this->reader(
                'cd',
                ArgumentGrammar::operands(OperandType::Path)->withOptions(...$this->flags('-P', '-L')),
                CommandClassSet::empty(),
            ),
            $this->reader(
                'export',
                ArgumentGrammar::operands(OperandType::Text)->repeating()->withOptions(...$this->flags('-n', '-p')),
                CommandClassSet::empty(),
            ),
            $this->reader(
                'tree',
                $this->paths()->withOptions(OptionGrammar::valued(OperandType::Count, '-L'), OptionGrammar::valued(OperandType::Pattern, '-I'), ...$this->flags('-a', '-d', '-f', '-h', '--gitignore')),
                $read,
            ),
        ];
    }

    private function reader(string $program, ArgumentGrammar $arguments, CommandClassSet $classes): CommandRule
    {
        return CommandRule::forProgram("core.{$program}", new ProgramSpellings($program), [], $arguments, $classes);
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
