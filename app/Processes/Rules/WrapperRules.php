<?php

declare(strict_types=1);

namespace App\Processes\Rules;

use App\Processes\Enums\CommandClass;
use App\Processes\Enums\OperandType;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\OptionGrammar;
use App\Processes\Values\WrapperRule;

/**
 * Core's wrappers (doc 21 revision 3, section 8): programs whose child command is classified as its own command, each
 * with the options it accepts before that command.
 */
final readonly class WrapperRules
{
    /**
     * @return array<string, WrapperRule>
     */
    public function byFamily(): array
    {
        $rules = [
            new WrapperRule(
                'env',
                [
                    OptionGrammar::flag('-i', '--ignore-environment'),
                    OptionGrammar::valued(OperandType::Name, '-u', '--unset'),
                ],
                CommandClassSet::empty(),
                takesAssignments: true,
            ),
            new WrapperRule('command', [OptionGrammar::flag('-p')], CommandClassSet::empty()),
            new WrapperRule('builtin', [], CommandClassSet::empty()),
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
                CommandClassSet::of(CommandClass::ProcessControl),
            ),
            new WrapperRule(
                'timeout',
                [
                    OptionGrammar::valued(OperandType::Text, '-s', '--signal'),
                    OptionGrammar::valued(OperandType::Text, '-k', '--kill-after'),
                    OptionGrammar::flag('--preserve-status'),
                    OptionGrammar::flag('--foreground'),
                ],
                CommandClassSet::of(CommandClass::ProcessControl),
                leadingOperands: 1,
            ),
            new WrapperRule('exec', [], CommandClassSet::of(CommandClass::ProcessControl)),
            new WrapperRule('time', [OptionGrammar::flag('-p')], CommandClassSet::empty()),
            new WrapperRule('xargs', [
                OptionGrammar::flag('-0', '--null'), OptionGrammar::flag(
                    '-r',
                    '--no-run-if-empty',
                ), OptionGrammar::flag('-t', '--verbose'),
                OptionGrammar::valued(OperandType::Count, '-n', '--max-args'), OptionGrammar::valued(
                    OperandType::Count,
                    '-L',
                    '--max-lines',
                ),
                OptionGrammar::valued(
                    OperandType::Count,
                    '-P',
                    '--max-procs',
                ), OptionGrammar::valued(OperandType::Text, '-d', '--delimiter'),
                OptionGrammar::valued(OperandType::Text, '-I'),
            ], CommandClassSet::empty()),
        ];

        return array_combine(array_map(fn (WrapperRule $rule): string => $rule->family, $rules), $rules);
    }
}
