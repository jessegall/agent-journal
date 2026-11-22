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
 * Package managers that install, update or remove dependencies: they reach the network and read, write and delete in
 * the project. Their script runners are not rules; task 770 resolves scripts to what they run.
 */
final readonly class PackageRules
{
    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        $install = CommandClassSet::of(
            CommandClass::PackageInstall,
            CommandClass::Read,
            CommandClass::Write,
            CommandClass::Delete,
            CommandClass::Network,
        );

        $npmOptions = [
            '--save-dev',
            '-D',
            '--save',
            '-S',
            '--no-save',
            '--global',
            '-g',
            '--legacy-peer-deps',
            '--ignore-scripts',
            '--production',
            '--omit=dev',
            '--silent',
            '--no-audit',
            '--no-fund',
            '--force',
        ];

        $composerOptions = [
            '--no-interaction',
            '-n',
            '--dev',
            '--no-dev',
            '--no-scripts',
            '-o',
            '--optimize-autoloader',
            '--prefer-dist',
            '--with-all-dependencies',
            '-W',
            '--with-dependencies',
            '-w',
            '--no-progress',
            '-q',
            '--quiet',
            '--ansi',
            '--no-ansi',
            '--no-install',
            '--update-with-dependencies',
        ];

        $rules = [];

        foreach ([
            'npm' => ['install', 'i', 'ci', 'update', 'uninstall', 'remove'],
            'pnpm' => ['install', 'i', 'add', 'remove', 'update'],
            'composer' => ['install', 'update', 'require', 'remove'],
        ] as $program => $subcommands) {
            foreach ($subcommands as $subcommand) {
                $options = $program === 'composer' ? $composerOptions : $npmOptions;

                $rules[] = CommandRule::forProgram(
                    "core.{$program}.{$subcommand}",
                    new ProgramSpellings($program),
                    [$subcommand],
                    ArgumentGrammar::operands(OperandType::Name)->repeating()->withOptions(
                        ...array_map(fn (string $flag) => OptionGrammar::flag($flag), $options),
                    ),
                    $install,
                );
            }
        }

        return $rules;
    }
}
