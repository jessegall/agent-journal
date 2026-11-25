<?php

declare(strict_types=1);

namespace App\Support\Rules;

use App\Enums\CommandClass;
use App\Enums\OperandType;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\OptionGrammar;
use App\Values\ProgramSpellings;

/**
 * Programs that only read: cat, head, tail, ls, pwd, wc, stat, file,
 * echo, printf, grep, rg, diff, which and tree, each with the options it is known to take.
 */
final readonly class ReadingRules
{
    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        $nameOperands = ArgumentGrammar::operands(OperandType::Name);
        $pathOperands = ArgumentGrammar::operands(OperandType::Path);
        $patternPathOperands = ArgumentGrammar::operands(OperandType::Pattern, OperandType::Path);
        $textOperands = ArgumentGrammar::operands(OperandType::Text);
        $bytesOption = OptionGrammar::valued(OperandType::Count, '-c', '--bytes');
        $maxCountOption = OptionGrammar::valued(OperandType::Count, '-m', '--max-count');
        $maxDepthOption = OptionGrammar::valued(OperandType::Count, '-d', '--max-depth');
        $linesOption = OptionGrammar::valued(OperandType::Count, '-n', '--lines');
        $regexpOption = OptionGrammar::valued(OperandType::Pattern, '-e', '--regexp');
        $colorOption = OptionGrammar::valued(OperandType::Text, '--color');

        $read = CommandClassSet::of(CommandClass::Read);

        return [
            $this->reader(
                'cat',
                $this->paths()->withOptions(...$this->flags('-n', '-b', '-A', '-e', '-s', '-v', '-E', '-T')),
                $read,
            ),
            $this->reader(
                'head',
                $this->paths()->acceptingNumericOptions()->withOptions(
                    $linesOption,
                    $bytesOption,
                    ...$this->flags('-q', '-v'),
                ),
                $read,
            ),
            $this->reader(
                'tail',
                $this->paths()->acceptingNumericOptions()->withOptions(
                    $linesOption,
                    $bytesOption,
                    ...$this->flags('-f', '-F', '--follow', '-q', '-v'),
                ),
                $read,
            ),
            $this->reader(
                'ls',
                $this->paths()->withOptions(
                    $colorOption,
                    ...$this->flags(
                        '-l',
                        '-a',
                        '-A',
                        '-h',
                        '-R',
                        '-t',
                        '-r',
                        '-S',
                        '-1',
                        '-d',
                        '-F',
                        '-G',
                        '-i',
                        '-s',
                        '--all',
                        '--user-readable',
                    ),
                ),
                $read,
            ),
            $this->reader('pwd', ArgumentGrammar::options([
                '-L',
                '-P',
            ]), $read),
            $this->reader('id', $nameOperands->withOptions(...$this->flags('-u', '-g', '-G', '-n', '-r')), $read),
            $this->reader(
                'test',
                $pathOperands->withOptions(...$this->flags('-e', '-f', '-d', '-r', '-w', '-x', '-s', '-L', '-h')),
                $read,
            ),
            $this->reader('wc', $this->paths()->withOptions(...$this->flags('-l', '-w', '-c', '-m', '-L')), $read),
            $this->reader(
                'stat',
                $this->paths()->withOptions(
                    OptionGrammar::valued(OperandType::Text, '-c', '--format'),
                    OptionGrammar::valued(OperandType::Text, '-f'),
                    ...$this->flags('-L', '-x'),
                ),
                $read,
            ),
            $this->reader('file', $this->paths()->withOptions(...$this->flags('-b', '-i', '-L', '--mime-type')), $read),
            $this->reader(
                'echo',
                $textOperands->repeating()->withOptions(
                    ...$this->flags('-n', '-e', '-E'),
                ),
                CommandClassSet::empty(),
            ),
            $this->reader(
                'printf',
                $textOperands->repeating(),
                CommandClassSet::empty(),
            ),
            $this->reader('grep', $patternPathOperands->repeating()->endingOptionsAtDoubleDash()->withOptions(
                $regexpOption,
                OptionGrammar::valued(
                    OperandType::Count,
                    '-A',
                ),
                OptionGrammar::valued(OperandType::Count, '-B'),
                OptionGrammar::valued(OperandType::Count, '-C'),
                $maxCountOption,
                OptionGrammar::valued(
                    OperandType::Pattern,
                    '--include',
                ),
                OptionGrammar::valued(OperandType::Pattern, '--exclude'),
                OptionGrammar::valued(
                    OperandType::Pattern,
                    '--exclude-dir',
                ),
                $colorOption,
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
            $this->reader('rg', $patternPathOperands->repeating()->endingOptionsAtDoubleDash()->withOptions(
                OptionGrammar::valued(
                    OperandType::Pattern,
                    '-g',
                    '--glob',
                ),
                OptionGrammar::valued(OperandType::Name, '-t', '--type'),
                OptionGrammar::valued(
                    OperandType::Name,
                    '-T',
                    '--type-not',
                ),
                OptionGrammar::valued(OperandType::Count, '-A', '--after-context'),
                OptionGrammar::valued(
                    OperandType::Count,
                    '-B',
                    '--before-context',
                ),
                OptionGrammar::valued(OperandType::Count, '-C', '--context'),
                $regexpOption,
                $maxCountOption,
                $maxDepthOption,
                OptionGrammar::valued(
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
                $this->paths()->withOptions(
                    OptionGrammar::valued(OperandType::Count, '-U', '--unified'),
                    ...$this->flags('-u', '-r', '-N', '-q', '-w', '-b', '-i', '-y', '--brief', '--recursive'),
                ),
                $read,
            ),
            $this->reader(
                'which',
                $nameOperands->repeating()->withOptions(...$this->flags('-a', '-s')),
                $read,
            ),
            $this->reader(
                'date',
                $textOperands->withOptions(
                    OptionGrammar::valued(OperandType::Text, '-d', '--date'),
                    OptionGrammar::valued(OperandType::Path, '-r', '--reference'),
                    ...$this->flags('-u', '-R', '-I', '--utc', '--iso-8601', '--rfc-2822'),
                ),
                $read,
            ),
            $this->reader(
                'ps',
                $textOperands->repeating()->withOptions(
                    OptionGrammar::valued(OperandType::Text, '-o', '-p', '-u', '-U', '-C', '--pid', '--ppid', '--sort'),
                    ...$this->flags(
                        '-e',
                        '-f',
                        '-A',
                        '-a',
                        '-x',
                        '-l',
                        '-w',
                        '-ww',
                        '-ef',
                        '-eo',
                        '-ax',
                        '--forest',
                        '--no-headers',
                    ),
                ),
                $read,
            ),
            $this->reader(
                'pgrep',
                ArgumentGrammar::operands(OperandType::Pattern)->withOptions(
                    OptionGrammar::valued(OperandType::Text, '-u', '-P', '-g'),
                    ...$this->flags('-f', '-l', '-a', '-x', '-n', '-o', '-c', '-i', '-fl', '-af'),
                ),
                $read,
            ),
            $this->reader(
                'lsof',
                $pathOperands->repeating()->withOptions(
                    OptionGrammar::valued(OperandType::Text, '-i', '-p', '-c', '-u', '-s'),
                    ...$this->flags('-n', '-P', '-t', '-a', '-nP', '-iTCP', '-sTCP:LISTEN'),
                ),
                $read,
            ),
            $this->reader(
                'cut',
                $this->paths()->withOptions(
                    OptionGrammar::valued(
                        OperandType::Text,
                        '-d',
                        '-f',
                        '-c',
                        '-b',
                        '--delimiter',
                        '--fields',
                        '--characters',
                    ),
                    ...$this->flags('-s', '--complement', '--only-delimited'),
                ),
                $read,
            ),
            $this->reader(
                'sort',
                $this->paths()->withOptions(
                    OptionGrammar::valued(OperandType::Text, '-k', '-t', '--key', '--field-separator'),
                    ...$this->flags(
                        '-n',
                        '-r',
                        '-u',
                        '-h',
                        '-V',
                        '-f',
                        '-b',
                        '-g',
                        '-s',
                        '-rn',
                        '-nr',
                        '-hr',
                        '--numeric-sort',
                        '--reverse',
                        '--unique',
                        '--user-numeric-sort',
                        '--version-sort',
                    ),
                ),
                $read,
            ),
            $this->reader(
                'tr',
                $textOperands->repeating()->withOptions(
                    ...$this->flags('-d', '-s', '-c', '-cd', '-ds', '--delete', '--squeeze-repeats'),
                ),
                $read,
            ),
            $this->reader(
                'du',
                $this->paths()->withOptions(
                    $maxDepthOption,
                    ...$this->flags(
                        '-s',
                        '-h',
                        '-a',
                        '-c',
                        '-k',
                        '-m',
                        '-x',
                        '-sh',
                        '-hs',
                        '-sk',
                        '--summarize',
                        '--user-readable',
                    ),
                ),
                $read,
            ),
            $this->reader(
                'jq',
                $patternPathOperands->repeating()->withOptions(
                    ...$this->flags(
                        '-r',
                        '-c',
                        '-e',
                        '-s',
                        '-n',
                        '-S',
                        '-j',
                        '-M',
                        '-C',
                        '-rc',
                        '--raw-output',
                        '--compact-output',
                        '--slurp',
                        '--sort-keys',
                    ),
                ),
                $read,
            ),
            $this->reader('sleep', $textOperands->repeating(), CommandClassSet::empty()),
            $this->reader('true', $textOperands->repeating(), CommandClassSet::empty()),
            $this->reader('false', $textOperands->repeating(), CommandClassSet::empty()),
            CommandRule::forProgram(
                'core.colon',
                new ProgramSpellings(':'),
                [],
                $textOperands->repeating(),
                CommandClassSet::empty(),
            ),
            $this->reader(
                'unset',
                $nameOperands->repeating()->withOptions(...$this->flags('-v', '-f')),
                CommandClassSet::empty(),
            ),
            $this->reader(
                'cd',
                $pathOperands->withOptions(...$this->flags('-P', '-L')),
                CommandClassSet::empty(),
            ),
            $this->reader(
                'export',
                $textOperands->repeating()->withOptions(...$this->flags('-n', '-p')),
                CommandClassSet::empty(),
            ),
            $this->reader(
                'tree',
                $this->paths()->withOptions(
                    OptionGrammar::valued(OperandType::Count, '-L'),
                    OptionGrammar::valued(OperandType::Pattern, '-I'),
                    ...$this->flags('-a', '-d', '-f', '-h', '--gitignore'),
                ),
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
