<?php

declare(strict_types=1);

namespace App\Support\Rules;

use App\Enums\CommandClass;
use App\Enums\OperandType;
use App\Values\CommandClassSet;
use App\Values\OptionGrammar;
use App\Values\WrapperRule;

/**
 * Core's wrappers: programs whose child command is classified as its own command, each
 * with the options it accepts before that command.
 */
final readonly class WrapperRules
{
    /**
     * @return array<string, WrapperRule>
     */
    public function byFamily(): array
    {
        $processControlClasses = CommandClassSet::of(CommandClass::ProcessControl);
        $pFlag = OptionGrammar::flag('-p');

        $rules = [
            new WrapperRule(
                'env',
                [
                    OptionGrammar::flag('-i', '--ignore-environment'),
                    OptionGrammar::valued(OperandType::Name, '-u', '--unset'),
                ],
                CommandClassSet::none(),
                takesAssignments: true,
            ),
            new WrapperRule('command', [$pFlag], CommandClassSet::none()),
            new WrapperRule('builtin', [], CommandClassSet::none()),
            new WrapperRule(
                'sudo',
                [
                    OptionGrammar::valued(OperandType::Name, '-u', '--user'),
                    OptionGrammar::valued(OperandType::Name, '-g', '--group'),
                    OptionGrammar::flag('-E', '--preserve-env'),
                    OptionGrammar::flag('-n', '--non-interactive'),
                    OptionGrammar::flag('-H', '--set-home'),
                ],
                CommandClassSet::of(CommandClass::PrivilegeChange),
            ),
            new WrapperRule(
                'nice',
                [OptionGrammar::valued(OperandType::Count, '-n', '--adjustment')],
                $processControlClasses,
            ),
            new WrapperRule(
                'timeout',
                [
                    OptionGrammar::valued(OperandType::Text, '-s', '--signal'),
                    OptionGrammar::valued(OperandType::Text, '-k', '--kill-after'),
                    OptionGrammar::flag('--preserve-status'),
                    OptionGrammar::flag('--foreground'),
                ],
                $processControlClasses,
                leadingOperands: 1,
            ),
            new WrapperRule('exec', [], $processControlClasses),
            new WrapperRule('time', [$pFlag], CommandClassSet::none()),
            new WrapperRule('xargs', [
                OptionGrammar::flag('-0', '--null'),
                OptionGrammar::flag(
                    '-r',
                    '--no-run-if-empty',
                ),
                OptionGrammar::flag('-t', '--verbose'),
                OptionGrammar::valued(OperandType::Count, '-n', '--max-args'),
                OptionGrammar::valued(
                    OperandType::Count,
                    '-L',
                    '--max-lines',
                ),
                OptionGrammar::valued(
                    OperandType::Count,
                    '-P',
                    '--max-procs',
                ),
                OptionGrammar::valued(OperandType::Text, '-d', '--delimiter'),
                OptionGrammar::valued(OperandType::Text, '-I'),
            ], CommandClassSet::none()),
        ];

        return array_combine(array_map(fn (WrapperRule $rule): string => $rule->family, $rules), $rules);
    }
}
