<?php

declare(strict_types=1);

namespace App\Domain\Processes;

use App\Core\Hooks\Inputs\CommandEffect;
use App\Core\Hooks\Inputs\CommandKind;

/**
 * What Processes knows about programs: which command lines are test runs or builds, which only read files and
 * which change them. A program it does not know has an unknown effect, never a safe one.
 */
final readonly class CommandCatalog
{
    private const JOURNAL_SUBCOMMANDS = [
        'alias', 'command-type', 'doc', 'helper', 'link', 'memory', 'message', 'output', 'overview', 'phase', 'plan', 'plugin',
        'process', 'question', 'reader', 'refusal', 'reminder', 'report', 'rule', 'search', 'sequence', 'setting', 'skill',
        'task', 'usage', 'wait', 'worker',
    ];

    private const TEST_RUNS = [
        'phpunit', 'vendor/bin/phpunit', 'pest', 'vendor/bin/pest', 'php artisan test', 'artisan test',
        'composer test', 'npm test', 'npm run test', 'yarn test', 'pnpm test', 'pytest', 'go test', 'cargo test',
    ];

    private const BUILDS = [
        'npm run build', 'yarn build', 'pnpm build', 'vite build', 'npx vite build', 'go build', 'cargo build', 'make',
    ];

    private const READING_PROGRAMS = [
        'cat', 'head', 'tail', 'less', 'grep', 'rg', 'ls', 'pwd', 'echo', 'wc', 'diff', 'which', 'stat', 'file', 'tree',
        'git status', 'git log', 'git diff', 'git show', 'git branch', 'git blame',
    ];

    private const WRITING_PROGRAMS = [
        'rm', 'mv', 'cp', 'mkdir', 'rmdir', 'touch', 'chmod', 'ln', 'tee', 'truncate', 'sed -i', 'perl -pi',
        'git add', 'git commit', 'git push', 'git checkout', 'git reset', 'git merge', 'git rebase', 'git stash', 'git mv', 'git rm',
    ];

    public function __construct(private SavedCommands $savedCommands) {}

    /**
     * @param  list<string>  $words  the program and its arguments
     */
    public function kindOf(array $words): CommandKind
    {
        if ($words[0] === 'journal') {
            return $this->journalKindOf(array_slice($words, 1));
        }

        if (self::startsWithAny($words, self::TEST_RUNS)) {
            return CommandKind::TestRun;
        }

        if (self::startsWithAny($words, self::BUILDS)) {
            return CommandKind::Build;
        }

        return CommandKind::Ordinary;
    }

    /**
     * @param  list<string>  $words  the program and its arguments
     */
    public function effectOf(array $words): CommandEffect
    {
        if ($words[0] === 'journal') {
            return CommandEffect::ReadsOnly;
        }

        if (self::startsWithAny($words, self::WRITING_PROGRAMS)) {
            return CommandEffect::ChangesFiles;
        }

        if (self::startsWithAny($words, self::READING_PROGRAMS)) {
            return CommandEffect::ReadsOnly;
        }

        return CommandEffect::Unknown;
    }

    /**
     * A journal line is saved only when it names a saved command, as journal <name> or journal run <name>; the
     * journal's own subcommands are ordinary, and any other name is unknown.
     *
     * @param  list<string>  $arguments  the words after journal
     */
    private function journalKindOf(array $arguments): CommandKind
    {
        $first = $arguments[0] ?? '';
        $name = $first === 'run' ? ($arguments[1] ?? '') : $first;

        if ($this->savedCommands->isSaved($name)) {
            return CommandKind::SavedCommand;
        }

        if (in_array($first, self::JOURNAL_SUBCOMMANDS, true)) {
            return CommandKind::Ordinary;
        }

        return CommandKind::Unknown;
    }

    /**
     * @param  list<string>  $words
     * @param  list<string>  $commands
     */
    private static function startsWithAny(array $words, array $commands): bool
    {
        $line = implode(' ', $words);

        foreach ($commands as $command) {
            if ($line === $command || str_starts_with($line, "{$command} ")) {
                return true;
            }
        }

        return false;
    }
}
