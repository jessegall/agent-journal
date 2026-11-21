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
 * Programs that control other processes: kill, wait and jobs.
 */
final readonly class ProcessRules
{
    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        $textOperands = ArgumentGrammar::operands(OperandType::Text);

        $control = CommandClassSet::of(CommandClass::ProcessControl);

        return [
            CommandRule::forProgram('core.kill', new ProgramSpellings('kill'), [], $textOperands->repeating()
                ->acceptingNumericOptions()->withOptions(
                    OptionGrammar::valued(
                        OperandType::Text,
                        '-s',
                    ),
                    OptionGrammar::flag('-l'),
                    OptionGrammar::flag('-TERM'),
                    OptionGrammar::flag('-KILL'),
                    OptionGrammar::flag('-INT'),
                    OptionGrammar::flag('-HUP'),
                ), $control),
            CommandRule::forProgram(
                'core.wait',
                new ProgramSpellings('wait'),
                [],
                $textOperands->repeating(),
                $control,
            ),
            CommandRule::forProgram(
                'core.jobs',
                new ProgramSpellings('jobs'),
                [],
                ArgumentGrammar::options(['-l', '-p']),
                $control,
            ),
        ];
    }
}
