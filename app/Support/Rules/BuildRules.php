<?php

declare(strict_types=1);

namespace App\Support\Rules;

use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\CommandType;
use App\Enums\CommandRules\OperandType;
use App\Enums\CommandRules\ToolType;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\OptionGrammar;
use App\Values\ProgramSpellings;

/**
 * Builds: their own purpose, Build, with the whole output kept; generating types is a
 * build that writes, never a check.
 */
final readonly class BuildRules
{
    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        $watchFlag = OptionGrammar::flag('--watch');

        $modeOption = OptionGrammar::valued(OperandType::Name, '--mode');

        $build = CommandClassSet::of(CommandClass::Build, CommandClass::Read, CommandClass::Write);

        return [
            $this->build(
                'core.vite.build',
                new ProgramSpellings('vite'),
                ['build'],
                ArgumentGrammar::none()->withOptions(
                    $modeOption,
                    $watchFlag,
                ),
                $build,
            ),
            $this->build(
                'core.vp.build',
                new ProgramSpellings('vp'),
                ['build'],
                ArgumentGrammar::none()->withOptions(
                    $modeOption,
                    $watchFlag,
                ),
                $build,
            ),
            $this->build('core.pnpm.build', new ProgramSpellings('pnpm'), ['build'], ArgumentGrammar::none(), $build),
            $this->build('core.yarn.build', new ProgramSpellings('yarn'), ['build'], ArgumentGrammar::none(), $build),
            $this->build(
                'core.php.artisan-typescript-transform',
                ProgramSpellings::php(),
                [
                    'artisan',
                    'typescript:transform',
                ],
                ArgumentGrammar::none(),
                $build,
            ),
            $this->build(
                'core.php.artisan-client-manifest',
                ProgramSpellings::php(),
                [
                    'artisan',
                    'journal:client-manifest',
                ],
                ArgumentGrammar::none(),
                $build,
            ),
            $this->build(
                'core.php.artisan-wayfinder-generate',
                ProgramSpellings::php(),
                [
                    'artisan',
                    'wayfinder:generate',
                ],
                ArgumentGrammar::options(['--with-form']),
                $build,
            ),
            $this->build(
                'core.go.build',
                new ProgramSpellings('go'),
                ['build'],
                ArgumentGrammar::operands(OperandType::Path)->repeating()->withOptions(
                    OptionGrammar::valued(OperandType::Path, '-o'),
                ),
                $build,
            ),
            $this->build(
                'core.cargo.build',
                new ProgramSpellings('cargo'),
                ['build'],
                ArgumentGrammar::none()->withOptions(OptionGrammar::flag('--release')),
                $build,
            ),
        ];
    }

    /**
     * @param  list<string>  $subcommands
     */
    private function build(
        string $id,
        ProgramSpellings $program,
        array $subcommands,
        ArgumentGrammar $arguments,
        CommandClassSet $classes,
    ): CommandRule {
        return CommandRule::forCheck(
            $id,
            $program,
            $subcommands,
            $arguments,
            $classes,
            CommandType::Build,
            in_array($id, [
                'core.vite.build',
                'core.vp.build',
            ], true) ? ToolType::ViteBuild : ToolType::Other,
        );
    }
}
