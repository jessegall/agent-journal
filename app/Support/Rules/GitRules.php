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
 * Git's subcommands, each with version_control: inspection forms read,
 * only the declared list and show forms of branch, tag, remote, config, stash and worktree count as inspection, and
 * every form that changes refs, the index, the work tree or a remote carries those classes. Global options before the
 * subcommand are read by the classifier.
 */
final readonly class GitRules
{
    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        $pathOperands = ArgumentGrammar::operands(OperandType::Path);

        $read = $this->classes(CommandClass::Read);
        $write = $this->classes(CommandClass::Read, CommandClass::Write);
        $delete = $this->classes(CommandClass::Read, CommandClass::Delete);
        $change = $this->classes(CommandClass::Read, CommandClass::Write, CommandClass::Edit, CommandClass::Delete);
        $remote = $this->classes(CommandClass::Network, CommandClass::Read, CommandClass::Write);

        $remoteChange = $this->classes(
            CommandClass::Network,
            CommandClass::Read,
            CommandClass::Write,
            CommandClass::Edit,
            CommandClass::Delete,
        );

        $revisions = fn (string ...$flags) => ArgumentGrammar::operands(
            OperandType::Revision,
        )->repeating()->endingOptionsAtDoubleDash()->acceptingNumericOptions()->withOptions(
            ...$this->flags(...$flags),
        );

        return [
            $this->rule(
                ['status'],
                $revisions(
                    '-s',
                    '--short',
                    '-b',
                    '--branch',
                    '--porcelain',
                    '--long',
                    '-u',
                    '--untracked-files',
                    '--ignored',
                    '-z',
                )->withOptions(
                    OptionGrammar::valued(OperandType::Text, '--porcelain'),
                    OptionGrammar::valued(OperandType::Text, '--untracked-files'),
                ),
                $read,
            ),
            $this->rule(
                ['log'],
                $revisions(
                    '--oneline',
                    '--graph',
                    '--all',
                    '--decorate',
                    '--stat',
                    '--shortstat',
                    '-p',
                    '--patch',
                    '--reverse',
                    '--first-parent',
                    '--no-merges',
                    '--merges',
                    '--name-only',
                    '--name-status',
                    '--follow',
                )->withOptions(
                    ...$this->valued(
                        '-n',
                        '--max-count',
                        '--format',
                        '--pretty',
                        '--since',
                        '--until',
                        '--author',
                        '--grep',
                        '--date',
                        '--skip',
                    ),
                ),
                $read,
            ),
            $this->rule(
                ['show'],
                $revisions(
                    '--stat',
                    '--name-only',
                    '--name-status',
                    '--oneline',
                    '-s',
                    '--no-patch',
                    '--quiet',
                )->withOptions(...$this->valued('--format', '--pretty')),
                $read,
            ),
            $this->rule(
                ['diff'],
                $revisions(
                    '--stat',
                    '--shortstat',
                    '--name-only',
                    '--name-status',
                    '--cached',
                    '--staged',
                    '--numstat',
                    '--word-diff',
                    '--no-color',
                    '--color',
                    '--exit-code',
                    '--quiet',
                    '-w',
                    '--check',
                )->withOptions(...$this->valued('-U', '--unified', '--diff-filter')),
                $read,
            ),
            $this->rule(
                ['blame'],
                $revisions('-w', '-e', '-s', '--porcelain')->withOptions(...$this->valued('-L')),
                $read,
            ),
            $this->rule(
                ['ls-files'],
                $revisions(
                    '-m',
                    '-o',
                    '-d',
                    '-c',
                    '-z',
                    '--others',
                    '--exclude-standard',
                    '--cached',
                    '--modified',
                    '--deleted',
                    '--error-unmatch',
                ),
                $read,
            ),
            $this->rule(
                ['rev-parse'],
                $revisions(
                    '--abbrev-ref',
                    '--short',
                    '--show-toplevel',
                    '--git-dir',
                    '--verify',
                    '-q',
                    '--is-inside-work-tree',
                    '--symbolic-full-name',
                ),
                $read,
            ),
            $this->namedRule(
                'branch-list',
                ['branch'],
                ArgumentGrammar::options(
                    [
                        '--list',
                        '-l',
                        '--show-current',
                        '-a',
                        '--all',
                        '-r',
                        '--remotes',
                        '-v',
                        '-vv',
                        '--merged',
                        '--no-merged',
                    ],
                )->withOptions(...$this->valued('--contains', '--sort', '--format')),
                $read,
            ),
            $this->namedRule(
                'branch-create',
                ['branch'],
                ArgumentGrammar::operands(
                    OperandType::Branch,
                    OperandType::Revision,
                )->requiringOperands(1)->withOptions(
                    ...$this->flags('-t', '--track', '--no-track', '-f', '--force'),
                ),
                $write,
            ),
            $this->namedRule(
                'branch-rename',
                ['branch'],
                ArgumentGrammar::optionWithOperands('-m', OperandType::Branch, OperandType::Branch),
                $write,
            ),
            $this->namedRule(
                'branch-delete',
                ['branch'],
                ArgumentGrammar::optionWithOperands('-d', OperandType::Branch)->repeating(),
                $delete,
            ),
            $this->namedRule(
                'branch-force-delete',
                ['branch'],
                ArgumentGrammar::optionWithOperands('-D', OperandType::Branch)->repeating(),
                $delete,
            ),
            $this->namedRule(
                'tag-list',
                ['tag'],
                ArgumentGrammar::options([
                    '-l',
                    '--list',
                    '-n',
                ])->withOptions(...$this->valued('--sort', '--contains')),
                $read,
            ),
            $this->namedRule(
                'tag-create',
                ['tag'],
                ArgumentGrammar::operands(OperandType::Name, OperandType::Revision)->requiringOperands(1)->withOptions(
                    ...$this->valued('-m', '--message'),
                    ...$this->flags('-a', '--annotate', '-f'),
                ),
                $write,
            ),
            $this->namedRule(
                'tag-delete',
                ['tag'],
                ArgumentGrammar::optionWithOperands('-d', OperandType::Name)->repeating(),
                $delete,
            ),
            $this->namedRule('remote-list', ['remote'], ArgumentGrammar::options([
                '-v',
                '--verbose',
            ]), $read),
            $this->namedRule(
                'config-get',
                ['config'],
                ArgumentGrammar::optionWithOperands('--get', OperandType::Name)->withOptions(
                    ...$this->flags('--global', '--local'),
                ),
                $read,
            ),
            $this->namedRule(
                'config-list',
                ['config'],
                ArgumentGrammar::optionWithOperands('--list')->withOptions(
                    ...$this->flags('--global', '--local', '--show-origin'),
                ),
                $read,
            ),
            $this->rule([
                'stash',
                'list',
            ], ArgumentGrammar::none(), $read),
            $this->rule([
                'stash',
                'show',
            ], $revisions('-p', '--stat'), $read),
            $this->rule([
                'worktree',
                'list',
            ], ArgumentGrammar::options(['--porcelain']), $read),
            $this->rule(
                ['add'],
                $pathOperands->repeating()->endingOptionsAtDoubleDash()->withOptions(
                    ...$this->flags(
                        '-A',
                        '--all',
                        '-u',
                        '--update',
                        '-p',
                        '--patch',
                        '-N',
                        '--intent-to-add',
                        '-f',
                        '--force',
                        '-v',
                    ),
                ),
                $write,
            ),
            $this->rule(
                ['commit'],
                $pathOperands->repeating()->endingOptionsAtDoubleDash()->withOptions(
                    ...$this->valued('-m', '--message', '-F', '--file', '--author', '--date'),
                    ...$this->flags(
                        '-a',
                        '--all',
                        '--amend',
                        '--no-edit',
                        '--allow-empty',
                        '-q',
                        '--quiet',
                        '--no-verify',
                        '-n',
                        '-s',
                        '--signoff',
                    ),
                ),
                $write,
            ),
            ...array_map(
                fn (string $subcommand) => $this->rule(
                    [$subcommand],
                    $revisions(
                        '-b',
                        '-B',
                        '-c',
                        '-C',
                        '-f',
                        '--force',
                        '-p',
                        '--patch',
                        '--hard',
                        '--soft',
                        '--mixed',
                        '--keep',
                        '--staged',
                        '--worktree',
                        '--continue',
                        '--abort',
                        '--skip',
                        '--no-edit',
                        '--ff-only',
                        '--no-ff',
                        '--squash',
                        '-i',
                        '--interactive',
                        '--onto',
                        '--theirs',
                        '--ours',
                        '-q',
                        '--quiet',
                        '--detach',
                        '-',
                    )->withOptions(...$this->valued('-m', '--message', '-s', '--source', '-X', '--strategy-option')),
                    $change,
                ),
                [
                    'checkout',
                    'switch',
                    'restore',
                    'reset',
                    'merge',
                    'rebase',
                    'cherry-pick',
                    'revert',
                ],
            ),
            ...array_map(
                fn (string $subcommand) => $this->rule(
                    [
                        'stash',
                        $subcommand,
                    ],
                    $revisions(
                        '-u',
                        '--include-untracked',
                        '-k',
                        '--keep-index',
                        '-q',
                        '--index',
                    )->withOptions(...$this->valued('-m', '--message')),
                    $change,
                ),
                [
                    'push',
                    'pop',
                    'apply',
                    'drop',
                    'clear',
                ],
            ),
            $this->namedRule(
                'stash-save',
                ['stash'],
                ArgumentGrammar::none()->withOptions(
                    ...$this->flags('-u', '--include-untracked', '-k', '--keep-index'),
                ),
                $change,
            ),
            $this->rule(
                ['clean'],
                $pathOperands->repeating()->endingOptionsAtDoubleDash()->withOptions(
                    ...$this->flags('-f', '-d', '-x', '-X', '-n', '--dry-run', '-q', '-i'),
                ),
                $delete,
            ),
            $this->rule(
                ['rm'],
                $pathOperands->repeating()->endingOptionsAtDoubleDash()->withOptions(
                    ...$this->flags('-r', '--cached', '-f', '--force', '-q', '-n', '--dry-run'),
                ),
                $this->classes(CommandClass::Read, CommandClass::Write, CommandClass::Delete),
            ),
            $this->rule(
                ['mv'],
                $pathOperands->repeating()->endingOptionsAtDoubleDash()->withOptions(
                    ...$this->flags('-f', '-k', '-n', '-v'),
                ),
                $this->classes(CommandClass::Read, CommandClass::Write, CommandClass::Delete),
            ),
            $this->rule(
                ['fetch'],
                $revisions(
                    '--all',
                    '--prune',
                    '-p',
                    '--tags',
                    '--no-tags',
                    '-q',
                    '--quiet',
                    '-v',
                    '--unshallow',
                )->withOptions(...$this->valued('--depth')),
                $remote,
            ),
            $this->namedRule(
                'push',
                ['push'],
                $revisions(
                    '-f',
                    '--force',
                    '--force-with-lease',
                    '-u',
                    '--set-upstream',
                    '--tags',
                    '--no-verify',
                    '-q',
                    '--quiet',
                    '-v',
                    '--dry-run',
                    '-n',
                ),
                $remote,
            ),
            $this->namedRule(
                'push-delete',
                ['push'],
                ArgumentGrammar::optionWithOperands(
                    '--delete',
                    OperandType::Remote,
                    OperandType::Branch,
                )->repeating()->withOptions(...$this->flags('-f', '--force', '-q')),
                $this->classes(CommandClass::Network, CommandClass::Read, CommandClass::Write, CommandClass::Delete),
            ),
            $this->rule(
                ['pull'],
                $revisions('--rebase', '--no-rebase', '--ff-only', '--no-edit', '-q', '--quiet', '--all', '--prune'),
                $remoteChange,
            ),
            $this->rule(
                ['clone'],
                ArgumentGrammar::operands(OperandType::Url, OperandType::Path)->withOptions(
                    ...$this->valued('--depth', '-b', '--branch'),
                    ...$this->flags('--recursive', '--recurse-submodules', '-q', '--single-branch', '--bare'),
                ),
                $remoteChange,
            ),
            $this->rule(
                [
                    'submodule',
                    'update',
                ],
                $pathOperands->repeating()->withOptions(
                    ...$this->flags('--init', '--recursive', '--remote'),
                ),
                $remoteChange,
            ),
            $this->rule(
                ['ls-remote'],
                ArgumentGrammar::operands(OperandType::Remote, OperandType::Pattern)->repeating()->withOptions(
                    ...$this->flags('--heads', '--tags', '-q', '--refs'),
                ),
                $this->classes(CommandClass::Network, CommandClass::Read),
            ),
        ];
    }

    /**
     * @param  list<string>  $subcommands
     */
    private function rule(array $subcommands, ArgumentGrammar $arguments, CommandClassSet $classes): CommandRule
    {
        return $this->namedRule(implode('-', $subcommands), $subcommands, $arguments, $classes);
    }

    /**
     * A rule whose id names what the git command does, for subcommands that do several things by option.
     *
     * @param  list<string>  $subcommands
     */
    private function namedRule(
        string $name,
        array $subcommands,
        ArgumentGrammar $arguments,
        CommandClassSet $classes,
    ): CommandRule {
        return CommandRule::forProgram(
            "core.git.{$name}",
            new ProgramSpellings('git'),
            $subcommands,
            $arguments,
            $classes,
        );
    }

    private function classes(CommandClass ...$classes): CommandClassSet
    {
        return CommandClassSet::of(CommandClass::VersionControl, ...$classes);
    }

    /**
     * @return list<OptionGrammar>
     */
    private function flags(string ...$names): array
    {
        return array_values(array_map(fn (string $name) => OptionGrammar::flag($name), $names));
    }

    /**
     * @return list<OptionGrammar>
     */
    private function valued(string ...$names): array
    {
        return array_values(array_map(fn (string $name) => OptionGrammar::valued(OperandType::Text, $name), $names));
    }
}
