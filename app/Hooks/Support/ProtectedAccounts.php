<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Hooks\Inputs\ProtectedFileRead;

/**
 * The folders of saved program accounts that model tools never reach on their own: every account's credentials,
 * settings and other sessions' histories. It also knows the commands that would read a sign-in some other way, such
 * as the macOS Keychain or the programs' own sign-in commands.
 */
final readonly class ProtectedAccounts
{
    private const string SIGN_IN_COMMAND = '/(^|[;&|(`])\s*(security|secret-tool)(\s|$)'
        .'|\b(claude|codex)\s+(auth|login|logout|setup-token|app-server)\b'
        .'|\$\{?(CLAUDE_CONFIG_DIR|CODEX_HOME|ANTHROPIC_CONFIG_DIR|JOURNAL_ACCOUNTS_ROOT)\b/';

    /**
     * @param  list<string>  $folders
     */
    public function __construct(public array $folders) {}

    public function covers(string $path): bool
    {
        foreach ($this->folders as $folder) {
            $root = rtrim($folder, '/');

            if ($root !== '' && ($path === $root || str_starts_with($path, $root.'/'))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Whether a shell command names a protected folder or reads a sign-in through another way.
     */
    public function isTouchedBy(string $command): bool
    {
        foreach ($this->folders as $folder) {
            if (rtrim($folder, '/') !== '' && str_contains($command, rtrim($folder, '/'))) {
                return true;
            }
        }

        return $this->readsSignIn($command);
    }

    /**
     * Whether a shell command reads a sign-in through the Keychain, a program's own sign-in commands or the variables
     * that name an account folder; no grant ever allows these.
     */
    public function readsSignIn(string $command): bool
    {
        return preg_match(self::SIGN_IN_COMMAND, $command) === 1;
    }

    /**
     * The words of a shell command that name a path, without the quotes around them, relative ones included.
     *
     * @return list<string>
     */
    public function pathsNamedIn(string $command): array
    {
        preg_match_all('#[^\s\'"`;&|<>()=]*/[^\s\'"`;&|<>()]*#', $command, $matches);

        return array_values(array_filter($matches[0], fn (string $word) => $word !== ''));
    }

    /**
     * Whether any text of a tool call reaches a protected folder, as a path from the work folder or in a command;
     * used where no grant can be read, so a session's own outputs are refused too.
     *
     * @param  array<array-key, mixed>  $toolInput
     */
    public function isTouchedByToolCall(array $toolInput, string $workFolder): bool
    {
        foreach ($toolInput as $value) {
            $isTouched = match (true) {
                is_array($value) => $this->isTouchedByToolCall($value, $workFolder),
                is_string($value) => $this->isTouchedBy($value)
                    || $this->covers(ProtectedFileRead::resolve($workFolder, $value)),
                default => false,
            };

            if ($isTouched) {
                return true;
            }
        }

        return false;
    }
}
