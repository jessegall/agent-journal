<?php

declare(strict_types=1);

namespace App\Domain\Processes;

use App\Domain\Hooks\Inputs\CommandEffect;
use App\Domain\Hooks\Inputs\CommandKind;

/**
 * What Processes knows about programs: which command lines are test runs or builds, which only read files and
 * which change them. A program it does not know has an unknown effect, never a safe one.
 */
final readonly class CommandCatalog
{
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

    /**
     * @param  list<string>  $words  the program and its arguments
     */
    public function kindOf(array $words): CommandKind
    {
        if ($words[0] === 'journal') {
            return CommandKind::SavedCommand;
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
