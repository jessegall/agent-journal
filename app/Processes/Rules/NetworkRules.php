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
 * Programs that reach the network (doc 21 revision 6, section 6): curl always, writing a file when told to save one and
 * reading and writing when it uploads data; wget always saves what it fetches.
 */
final readonly class NetworkRules
{
    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        $curl = new ProgramSpellings('curl');

        return [
            CommandRule::forProgram(
                'core.curl.fetch',
                $curl,
                [],
                $this->curl(),
                CommandClassSet::of(CommandClass::Network),
            ),
            CommandRule::forProgram(
                'core.curl.save',
                $curl,
                [],
                $this->curl()->withOptions(OptionGrammar::valued(OperandType::Path, '-o', '--output')->required()),
                CommandClassSet::of(CommandClass::Network, CommandClass::Write),
            ),
            CommandRule::forProgram(
                'core.curl.save-remote-name',
                $curl,
                [],
                $this->curl()->withOptions(OptionGrammar::flag('-O', '--remote-name')->required()),
                CommandClassSet::of(CommandClass::Network, CommandClass::Write),
            ),
            CommandRule::forProgram(
                'core.curl.upload',
                $curl,
                [],
                $this->curl()->withOptions(
                    OptionGrammar::valued(OperandType::Text, '-d', '--data')->required(),
                    OptionGrammar::valued(OperandType::Text, '--data-raw'),
                    OptionGrammar::valued(OperandType::Text, '-F', '--form'),
                ),
                CommandClassSet::of(CommandClass::Network, CommandClass::Read, CommandClass::Write),
            ),
            CommandRule::forProgram('core.wget', new ProgramSpellings('wget'), [], ArgumentGrammar::operands(
                OperandType::Url,
            )->repeating()->withOptions(
                OptionGrammar::valued(OperandType::Path, '-O', '--output-document'), OptionGrammar::valued(
                    OperandType::Path,
                    '-P',
                    '--directory-prefix',
                ),
                OptionGrammar::flag('-q', '--quiet'), OptionGrammar::flag('-c', '--continue'), OptionGrammar::flag(
                    '-nv',
                    '--no-verbose',
                ), OptionGrammar::flag('--spider'),
            ), CommandClassSet::of(CommandClass::Network, CommandClass::Write)),
        ];
    }

    /**
     * The options every curl form shares; saving and uploading options belong to their own forms.
     */
    private function curl(): ArgumentGrammar
    {
        return ArgumentGrammar::operands(OperandType::Url)->repeating()->withOptions(
            OptionGrammar::valued(
                OperandType::Text,
                '-X',
                '--request',
            ), OptionGrammar::valued(OperandType::Text, '-H', '--header'),
            OptionGrammar::valued(OperandType::Text, '-u', '--user'), OptionGrammar::valued(
                OperandType::Text,
                '-w',
                '--write-out',
            ),
            OptionGrammar::valued(OperandType::Count, '-m', '--max-time'), OptionGrammar::valued(
                OperandType::Text,
                '-A',
                '--user-agent',
            ),
            OptionGrammar::valued(
                OperandType::Count,
                '--connect-timeout',
            ), OptionGrammar::valued(OperandType::Count, '--retry'),
            OptionGrammar::flag('-s', '--silent'), OptionGrammar::flag(
                '-S',
                '--show-error',
            ), OptionGrammar::flag('-L', '--location'),
            OptionGrammar::flag('-f', '--fail'), OptionGrammar::flag('-I', '--head'), OptionGrammar::flag(
                '-v',
                '--verbose',
            ),
            OptionGrammar::flag(
                '-k',
                '--insecure',
            ), OptionGrammar::flag('-i', '--include'), OptionGrammar::flag('--compressed'),
        );
    }
}
