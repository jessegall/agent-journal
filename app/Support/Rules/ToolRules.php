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
 * The reviewed rules of the developer tools the shell corpus still left unknown: the GitHub CLI, Docker,
 * Go's other verbs, SQLite, SSH without a remote command, PHP's own options, the read verbs of npm and Composer, and
 * Vitest. Every option is listed; an unlisted one stays unknown. make, interpreters, docker exec and remote commands
 * stay unknown by decision.
 */
final readonly class ToolRules
{
    private const CommandType CHECK = CommandType::Verification;

    private const array GH_READS = [
        'pr' => [
            'view',
            'list',
            'diff',
            'checks',
            'status',
        ],
        'issue' => [
            'view',
            'list',
            'status',
        ],
        'run' => [
            'list',
            'view',
            'watch',
        ],
    ];

    private const array GH_WRITES = [
        'pr' => [
            'create',
            'comment',
            'edit',
            'close',
            'merge',
            'reopen',
        ],
        'issue' => [
            'create',
            'comment',
            'edit',
            'close',
            'reopen',
        ],
    ];

    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        return [
            ...$this->github(),
            ...$this->docker(),
            ...$this->go(),
            ...$this->databases(),
            ...$this->packages(),
        ];
    }

    /**
     * @return list<CommandRule>
     */
    private function github(): array
    {
        $gh = new ProgramSpellings('gh');
        $read = CommandClassSet::of(CommandClass::Network, CommandClass::Read);
        $write = CommandClassSet::of(CommandClass::Network, CommandClass::Write);
        $rules = [];

        foreach (self::GH_READS as $group => $verbs) {
            foreach ($verbs as $verb) {
                $id = "core.gh.{$group}-{$verb}";

                $rules[] = CommandRule::forProgram($id, $gh, [
                    $group,
                    $verb,
                ], $this->ghReading(), $read);
            }
        }

        foreach (self::GH_WRITES as $group => $verbs) {
            foreach ($verbs as $verb) {
                $id = "core.gh.{$group}-{$verb}";

                $rules[] = CommandRule::forProgram($id, $gh, [
                    $group,
                    $verb,
                ], $this->ghWriting(), $write);
            }
        }

        $api = ArgumentGrammar::operands(OperandType::Text)->withOptions(
            OptionGrammar::valued(OperandType::Text, '--jq', '-q'),
            OptionGrammar::flag('--paginate'),
            OptionGrammar::valued(OperandType::Text, '-H', '--header'),
        );

        $rules[] = CommandRule::forProgram('core.gh.api-read', $gh, ['api'], $api, $read);

        return $rules;
    }

    private function ghReading(): ArgumentGrammar
    {
        return ArgumentGrammar::operands(OperandType::Text)->withOptions(
            OptionGrammar::valued(OperandType::Text, '--json'),
            OptionGrammar::valued(OperandType::Text, '--jq', '-q'),
            OptionGrammar::valued(OperandType::Count, '--limit', '-L'),
            OptionGrammar::valued(OperandType::Text, '--state', '-s'),
            OptionGrammar::valued(OperandType::Name, '--repo', '-R'),
            OptionGrammar::valued(OperandType::Branch, '--branch', '-b'),
            OptionGrammar::flag('--web', '-w'),
            OptionGrammar::flag('--log'),
            OptionGrammar::flag('--log-failed'),
            OptionGrammar::flag('--exit-status'),
        );
    }

    private function ghWriting(): ArgumentGrammar
    {
        return ArgumentGrammar::operands(OperandType::Text)->withOptions(
            OptionGrammar::valued(OperandType::Text, '--title', '-t'),
            OptionGrammar::valued(OperandType::Text, '--body', '-b'),
            OptionGrammar::valued(OperandType::Path, '--body-file', '-F'),
            OptionGrammar::valued(OperandType::Branch, '--base', '-B'),
            OptionGrammar::valued(OperandType::Branch, '--head', '-H'),
            OptionGrammar::valued(OperandType::Name, '--repo', '-R'),
            OptionGrammar::valued(OperandType::Text, '--label', '-l'),
            OptionGrammar::flag('--draft', '-d'),
            OptionGrammar::flag('--squash', '-s'),
            OptionGrammar::flag('--merge', '-m'),
            OptionGrammar::flag('--rebase', '-r'),
            OptionGrammar::flag('--delete-branch'),
        );
    }

    /**
     * Listing and logs only read; building and bringing services up start processes and write images.
     *
     * @return list<CommandRule>
     */
    private function docker(): array
    {
        $nameOperands = ArgumentGrammar::operands(OperandType::Name);

        $docker = new ProgramSpellings('docker');
        $read = CommandClassSet::of(CommandClass::Read);
        $process = CommandClassSet::of(CommandClass::ProcessControl, CommandClass::Write);

        $listing = $nameOperands->repeating()->withOptions(
            OptionGrammar::flag('-a', '--all'),
            OptionGrammar::flag('-q', '--quiet'),
            OptionGrammar::valued(OperandType::Text, '--format'),
        );

        $logs = $nameOperands->repeating()->withOptions(
            OptionGrammar::valued(OperandType::Count, '--tail', '-n'),
            OptionGrammar::valued(OperandType::Text, '--since'),
        );

        $build = ArgumentGrammar::operands(OperandType::Path)->withOptions(
            OptionGrammar::valued(OperandType::Name, '-t', '--tag'),
            OptionGrammar::valued(OperandType::Path, '-f', '--file'),
            OptionGrammar::flag('--no-cache'),
            OptionGrammar::valued(OperandType::Text, '--progress'),
        );

        $up = $nameOperands->repeating()->withOptions(
            OptionGrammar::flag('-d', '--detach'),
            OptionGrammar::flag('--build'),
        );

        return [
            CommandRule::forProgram('core.docker.ps', $docker, ['ps'], $listing, $read),
            CommandRule::forProgram('core.docker.logs', $docker, ['logs'], $logs, $read),
            CommandRule::forProgram('core.docker.images', $docker, ['images'], $listing, $read),
            CommandRule::forProgram('core.docker.build', $docker, ['build'], $build, $process),
            CommandRule::forProgram('core.docker.compose-ps', $docker, [
                'compose',
                'ps',
            ], $listing, $read),
            CommandRule::forProgram('core.docker.compose-logs', $docker, [
                'compose',
                'logs',
            ], $logs, $read),
            CommandRule::forProgram('core.docker.compose-build', $docker, [
                'compose',
                'build',
            ], $build, $process),
            CommandRule::forProgram('core.docker.compose-up', $docker, [
                'compose',
                'up',
            ], $up, $process),
        ];
    }

    /**
     * @return list<CommandRule>
     */
    private function go(): array
    {
        $go = new ProgramSpellings('go');
        $paths = ArgumentGrammar::operands(OperandType::Path)->repeating();
        $names = ArgumentGrammar::operands(OperandType::Name)->repeating();
        $vet = CommandClassSet::of(CommandClass::Verification, CommandClass::Read);
        $tidy = CommandClassSet::of(CommandClass::Network, CommandClass::Edit);
        $download = CommandClassSet::of(CommandClass::Network, CommandClass::Write);
        $read = CommandClassSet::of(CommandClass::Read);

        return [
            CommandRule::forCheck('core.go.vet', $go, ['vet'], $paths, $vet, self::CHECK, ToolType::Other),
            CommandRule::forProgram('core.go.mod-tidy', $go, [
                'mod',
                'tidy',
            ], ArgumentGrammar::none(), $tidy),
            CommandRule::forProgram('core.go.mod-download', $go, [
                'mod',
                'download',
            ], $paths, $download),
            CommandRule::forProgram('core.go.version', $go, ['version'], ArgumentGrammar::none(), $read),
            CommandRule::forProgram('core.go.env', $go, ['env'], $names, $read),
        ];
    }

    /**
     * SQLite reads with -readonly and may write without it; SSH logs in only without a remote command, which stays
     * unknown; PHP's own informational options only read.
     *
     * @return list<CommandRule>
     */
    private function databases(): array
    {
        $jsonFlag = OptionGrammar::flag('-json');

        $sqlite = new ProgramSpellings('sqlite3');
        $query = ArgumentGrammar::operands(OperandType::Path, OperandType::Text)->requiringOperands(1);
        $readOnly = $query->withOptions(OptionGrammar::flag('-readonly')->required(), $jsonFlag);

        $login = ArgumentGrammar::operands(OperandType::Name)->requiringOperands(1)->withOptions(
            OptionGrammar::valued(OperandType::Count, '-p'),
            OptionGrammar::valued(OperandType::Path, '-i'),
        );

        $information = ArgumentGrammar::none()->withOptions(
            OptionGrammar::flag('-v', '--version'),
            OptionGrammar::flag('-m'),
            OptionGrammar::flag('-i'),
            OptionGrammar::valued(OperandType::Path, '-l'),
        );

        $php = ProgramSpellings::php();
        $read = CommandClassSet::of(CommandClass::Read);

        return [
            CommandRule::forProgram('core.sqlite3.read', $sqlite, [], $readOnly, $read),
            CommandRule::forProgram(
                'core.sqlite3.write',
                $sqlite,
                [],
                $query->withOptions($jsonFlag),
                CommandClassSet::of(CommandClass::Read, CommandClass::Write),
            ),
            CommandRule::forProgram(
                'core.ssh.login',
                new ProgramSpellings('ssh'),
                [],
                $login,
                CommandClassSet::of(CommandClass::Network, CommandClass::ProcessControl),
            ),
            CommandRule::forProgram('core.php.information', $php, [], $information, $read),
        ];
    }

    /**
     * @return list<CommandRule>
     */
    private function packages(): array
    {
        $npm = new ProgramSpellings('npm');
        $composer = new ProgramSpellings('composer');
        $names = ArgumentGrammar::operands(OperandType::Name)->repeating()->withOptions(OptionGrammar::flag('--json'));
        $networkRead = CommandClassSet::of(CommandClass::Network, CommandClass::Read);
        $read = CommandClassSet::of(CommandClass::Read);

        $vitest = ArgumentGrammar::operands(OperandType::Path)->repeating()->withOptions(
            OptionGrammar::valued(OperandType::Pattern, '-t', '--testNamePattern'),
            OptionGrammar::valued(OperandType::Text, '--reporter'),
            OptionGrammar::flag('--coverage'),
        );

        $check = CommandClassSet::of(CommandClass::Verification, CommandClass::Read);

        return [
            CommandRule::forProgram('core.npm.outdated', $npm, ['outdated'], $names, $networkRead),
            CommandRule::forProgram('core.npm.view', $npm, ['view'], $names, $networkRead),
            CommandRule::forProgram('core.npm.ls', $npm, ['ls'], $names, $read),
            CommandRule::forProgram('core.composer.outdated', $composer, ['outdated'], $names, $networkRead),
            CommandRule::forProgram('core.composer.show', $composer, ['show'], $names, $read),
            CommandRule::forCheck(
                'core.vitest.run',
                new ProgramSpellings('vitest'),
                ['run'],
                $vitest,
                $check,
                self::CHECK,
                ToolType::Other,
            ),
        ];
    }
}
