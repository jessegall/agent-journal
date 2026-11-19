<?php

declare(strict_types=1);

namespace App\Processes\Rules;

use App\Processes\Enums\CommandClass;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\OperandType;
use App\Processes\Enums\ToolType;
use App\Processes\Values\ArgumentGrammar;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandRule;
use App\Processes\Values\OptionGrammar;
use App\Processes\Values\ProgramSpellings;

/**
 * Builds (doc 21 revision 6, section 68): their own purpose, Build, with the whole output kept; generating types is a
 * build that writes, never a check.
 */
final readonly class BuildRules
{
    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        $build = CommandClassSet::of(CommandClass::Build, CommandClass::Read, CommandClass::Write);

        return [
            $this->build('core.vite.build', new ProgramSpellings('vite'), ['build'], ArgumentGrammar::none()->withOptions(OptionGrammar::valued(OperandType::Name, '--mode'), OptionGrammar::flag('--watch')), $build),
            $this->build('core.vp.build', new ProgramSpellings('vp'), ['build'], ArgumentGrammar::none()->withOptions(OptionGrammar::valued(OperandType::Name, '--mode'), OptionGrammar::flag('--watch')), $build),
            $this->build('core.pnpm.build', new ProgramSpellings('pnpm'), ['build'], ArgumentGrammar::none(), $build),
            $this->build('core.yarn.build', new ProgramSpellings('yarn'), ['build'], ArgumentGrammar::none(), $build),
            $this->build('core.php.artisan-typescript-transform', new ProgramSpellings('php', ['php8.1', 'php8.2', 'php8.3', 'php8.4', 'php8.5']), ['artisan', 'typescript:transform'], ArgumentGrammar::none(), $build),
            $this->build('core.php.artisan-ui-manifest', new ProgramSpellings('php', ['php8.1', 'php8.2', 'php8.3', 'php8.4', 'php8.5']), ['artisan', 'journal:ui-manifest'], ArgumentGrammar::none(), $build),
            $this->build('core.php.artisan-wayfinder-generate', new ProgramSpellings('php', ['php8.1', 'php8.2', 'php8.3', 'php8.4', 'php8.5']), ['artisan', 'wayfinder:generate'], ArgumentGrammar::options(['--with-form']), $build),
            $this->build('core.go.build', new ProgramSpellings('go'), ['build'], ArgumentGrammar::operands(OperandType::Path)->repeating()->withOptions(OptionGrammar::valued(OperandType::Path, '-o')), $build),
            $this->build('core.cargo.build', new ProgramSpellings('cargo'), ['build'], ArgumentGrammar::none()->withOptions(OptionGrammar::flag('--release')), $build),
        ];
    }

    /**
     * @param  list<string>  $subcommands
     */
    private function build(string $id, ProgramSpellings $program, array $subcommands, ArgumentGrammar $arguments, CommandClassSet $classes): CommandRule
    {
        return CommandRule::forCheck($id, $program, $subcommands, $arguments, $classes, CommandType::Build, in_array($id, ['core.vite.build', 'core.vp.build'], true) ? ToolType::ViteBuild : ToolType::Other);
    }
}
