<?php

declare(strict_types=1);

namespace App\Support\Rules;

use App\Enums\CommandClass;
use App\Enums\CommandType;
use App\Enums\OperandType;
use App\Enums\ToolType;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\OptionGrammar;
use App\Values\ProgramSpellings;

/**
 * Tests and checks: one purpose, Verification, for test runners, static analysis, the
 * formatter, the commandments judge and type checks, each keeping its whole output. A check that only reads differs
 * from a fixing formatter by its classes, never by its purpose; an option not listed leaves the command unknown, never
 * an ordinary run.
 */
final readonly class CheckRules
{
    private const array TOOLS = [
        'core.php.artisan-test' => ToolType::PhpUnit,
        'core.phpunit' => ToolType::PhpUnit,
        'core.pest' => ToolType::Pest,
        'core.phpstan.analyse' => ToolType::Phpstan,
        'core.phpstan.analyze' => ToolType::Phpstan,
        'core.pint.test' => ToolType::PintCheck,
        'core.pint.fix' => ToolType::PintFix,
        'core.commandments.judge' => ToolType::CommandmentsJudge,
        'core.vue-tsc' => ToolType::VueTsc,
        'core.tsc' => ToolType::Tsc,
    ];

    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        $noEmitOperands = ArgumentGrammar::optionWithOperands('--noEmit');

        $pathOperands = ArgumentGrammar::operands(OperandType::Path);
        $projectOption = OptionGrammar::valued(OperandType::Path, '-p', '--project');

        $read = CommandClassSet::of(CommandClass::Verification, CommandClass::Read);
        $fix = CommandClassSet::of(CommandClass::Verification, CommandClass::Read, CommandClass::Edit);
        $php = ProgramSpellings::php();

        return [
            $this->check('core.php.artisan-test', $php, [
                'artisan',
                'test',
            ], $this->testRunner(), $read),
            $this->check(
                'core.phpunit',
                new ProgramSpellings('phpunit', ['phpunit.phar']),
                [],
                $this->testRunner(),
                $read,
            ),
            $this->check('core.pest', new ProgramSpellings('pest'), [], $this->testRunner(), $read),
            $this->check(
                'core.phpstan.analyse',
                new ProgramSpellings('phpstan', ['phpstan.phar']),
                ['analyse'],
                $this->phpstan(),
                $read,
            ),
            $this->check(
                'core.phpstan.analyze',
                new ProgramSpellings('phpstan', ['phpstan.phar']),
                ['analyze'],
                $this->phpstan(),
                $read,
            ),
            $this->check(
                'core.pint.test',
                new ProgramSpellings('pint'),
                [],
                $this->pint()->withOptions(OptionGrammar::flag('--test')->required()),
                $read,
            ),
            $this->check('core.pint.fix', new ProgramSpellings('pint'), [], $this->pint(), $fix),
            $this->check(
                'core.php-cs-fixer.check',
                new ProgramSpellings('php-cs-fixer'),
                ['check'],
                $this->phpCsFixer(),
                $read,
            ),
            $this->check(
                'core.php-cs-fixer.fix',
                new ProgramSpellings('php-cs-fixer'),
                ['fix'],
                $this->phpCsFixer(),
                $fix,
            ),
            $this->check('core.commandments.judge', new ProgramSpellings(
                'commandments',
                [
                    'commandments-release',
                    'commandments-go',
                ],
            ), ['judge'], $pathOperands->withOptions(
                OptionGrammar::flag('--changes'),
                OptionGrammar::flag('--changed-files'),
                OptionGrammar::valued(
                    OperandType::Revision,
                    '--branch',
                ),
                OptionGrammar::valued(OperandType::Name, '--sin'),
                OptionGrammar::valued(
                    OperandType::Text,
                    '--repent',
                ),
            ), $read),
            $this->check(
                'core.vue-tsc',
                new ProgramSpellings('vue-tsc'),
                [],
                $noEmitOperands->withOptions(
                    $projectOption,
                ),
                $read,
            ),
            $this->check(
                'core.tsc',
                new ProgramSpellings('tsc'),
                [],
                $noEmitOperands->withOptions(
                    $projectOption,
                ),
                $read,
            ),
            $this->check(
                'core.vp.check',
                new ProgramSpellings('vp'),
                ['check'],
                $pathOperands->repeating(),
                $read,
            ),
            $this->check(
                'core.vp.check-fix',
                new ProgramSpellings('vp'),
                ['check'],
                ArgumentGrammar::optionWithOperands('--fix', OperandType::Path)->repeating(),
                $fix,
            ),
            $this->check(
                'core.vp.test',
                new ProgramSpellings('vp'),
                [
                    'test',
                    'run',
                ],
                $pathOperands->repeating(),
                $read,
            ),
            $this->check('core.pytest', new ProgramSpellings('pytest'), [], $this->pytest(), $read),
            $this->check(
                'core.go.test',
                new ProgramSpellings('go'),
                ['test'],
                $pathOperands->repeating()->withOptions(
                    OptionGrammar::valued(OperandType::Pattern, '-run'),
                    OptionGrammar::flag('-v'),
                    OptionGrammar::flag('-race'),
                    OptionGrammar::valued(OperandType::Count, '-count'),
                ),
                $read,
            ),
            $this->check(
                'core.cargo.test',
                new ProgramSpellings('cargo'),
                ['test'],
                ArgumentGrammar::operands(OperandType::Pattern)->withOptions(
                    OptionGrammar::flag('--release'),
                    OptionGrammar::flag('-q'),
                ),
                $read,
            ),
            $this->check('core.yarn.test', new ProgramSpellings('yarn'), ['test'], ArgumentGrammar::none(), $read),
        ];
    }

    /**
     * @param  list<string>  $subcommands
     */
    private function check(
        string $id,
        ProgramSpellings $program,
        array $subcommands,
        ArgumentGrammar $arguments,
        CommandClassSet $classes,
    ): CommandRule {
        $tool = self::TOOLS[$id] ?? ToolType::Other;

        return CommandRule::forCheck(
            $id,
            $program,
            $subcommands,
            $arguments,
            $classes,
            CommandType::Verification,
            $tool,
        );
    }

    private function testRunner(): ArgumentGrammar
    {
        return ArgumentGrammar::operands(OperandType::Path)->repeating()->withOptions(
            OptionGrammar::valued(
                OperandType::Pattern,
                '--filter',
            ),
            OptionGrammar::valued(
                OperandType::Name,
                '--testsuite',
            ),
            OptionGrammar::valued(OperandType::Name, '--group'),
            OptionGrammar::valued(OperandType::Count, '--processes'),
            OptionGrammar::valued(
                OperandType::Path,
                '-c',
                '--configuration',
            ),
            OptionGrammar::flag('--parallel'),
            OptionGrammar::flag('--recreate-databases'),
            OptionGrammar::flag('--compact'),
            OptionGrammar::flag('--stop-on-failure'),
            OptionGrammar::flag('--testdox'),
            OptionGrammar::flag('--coverage'),
            OptionGrammar::flag('--display-errors'),
            OptionGrammar::flag('--no-coverage'),
            OptionGrammar::flag('--teamcity'),
        );
    }

    private function phpstan(): ArgumentGrammar
    {
        return ArgumentGrammar::operands(OperandType::Path)->repeating()->withOptions(
            OptionGrammar::valued(OperandType::Text, '--memory-limit'),
            OptionGrammar::valued(
                OperandType::Path,
                '-c',
                '--configuration',
            ),
            OptionGrammar::valued(OperandType::Text, '-l', '--level'),
            OptionGrammar::valued(
                OperandType::Name,
                '--error-format',
            ),
            OptionGrammar::flag('--no-progress'),
            OptionGrammar::flag('--ansi'),
            OptionGrammar::flag('--no-ansi'),
        );
    }

    /**
     * The project's own code-style fixers, run after Pint by the lint scripts.
     */
    private function phpCsFixer(): ArgumentGrammar
    {
        return ArgumentGrammar::operands(OperandType::Path)->repeating()->withOptions(
            OptionGrammar::flag('--quiet'),
            OptionGrammar::flag('--dry-run'),
            OptionGrammar::valued(OperandType::Path, '--config'),
            OptionGrammar::valued(OperandType::Name, '--path-mode'),
        );
    }

    private function pint(): ArgumentGrammar
    {
        return ArgumentGrammar::operands(OperandType::Path)->repeating()->withOptions(
            OptionGrammar::flag('--dirty'),
            OptionGrammar::flag('--parallel'),
            OptionGrammar::valued(
                OperandType::Name,
                '--format',
            ),
            OptionGrammar::valued(OperandType::Path, '--config'),
            OptionGrammar::flag('-v'),
        );
    }

    /**
     * The pytest options a check run may take: selection, stopping, verbosity and the report of failures.
     */
    private function pytest(): ArgumentGrammar
    {
        return ArgumentGrammar::operands(OperandType::Path)->repeating()->withOptions(
            OptionGrammar::valued(OperandType::Pattern, '-k'),
            OptionGrammar::valued(OperandType::Pattern, '-m'),
            OptionGrammar::valued(OperandType::Count, '--maxfail'),
            OptionGrammar::valued(OperandType::Text, '--tb'),
            OptionGrammar::flag('-x', '--exitfirst'),
            OptionGrammar::flag('-q', '--quiet'),
            OptionGrammar::flag('-v', '--verbose'),
            OptionGrammar::flag('-s'),
            OptionGrammar::flag('-rf'),
            OptionGrammar::flag('--lf', '--last-failed'),
        );
    }
}
