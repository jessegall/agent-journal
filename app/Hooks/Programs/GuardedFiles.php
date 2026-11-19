<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Contracts\FileAccessPolicy;
use App\Hooks\Contracts\ProgramCall;
use App\Hooks\Enums\FileAccess;
use App\Hooks\Inputs\HookIdentity;
use App\Processes\Values\CommandPart;
use App\Processes\Values\ShellCommand;
use Closure;
use PhpOption\None;
use PhpOption\Option;

/**
 * Puts a tool's files before the file access policy: the first refused file denies the tool call without asking any
 * state, and a call whose files all pass goes on as the adapter built it.
 */
final readonly class GuardedFiles
{
    public function __construct(private FileAccessPolicy $policy) {}

    /**
     * @param  list<string>  $paths
     * @param  Closure(): ProgramCall  $call
     */
    public function guard(HookIdentity $hook, FileAccess $access, array $paths, Closure $call): ProgramCall
    {
        return $this->firstRefusal($hook, $access, $paths)
            ->map(fn (string $refusal): ProgramCall => new UnjudgedCall(ProgramReplies::denyTool($refusal, [])))
            ->getOrCall($call);
    }

    /**
     * A shell line's every argument, judged as a write in a part that may change files and as a read in any other. A
     * line the parser could not read fully has no trusted parts, so each word of its text is judged as a write.
     *
     * @param  Closure(): ProgramCall  $call
     */
    public function guardShell(HookIdentity $hook, ShellCommand $command, Closure $call): ProgramCall
    {
        if (! $command->outcome->isComplete()) {
            return $this->guard($hook, FileAccess::Write, self::wordsOf($command->source), $call);
        }

        foreach ($command->parts as $part) {
            $refusal = $this->firstRefusal($hook, $this->accessOf($part), $part->arguments);

            if ($refusal->isDefined()) {
                return new UnjudgedCall(ProgramReplies::denyTool($refusal->get(), []));
            }
        }

        return $call();
    }

    /**
     * @param  list<string>  $paths
     * @return Option<string>
     */
    private function firstRefusal(HookIdentity $hook, FileAccess $access, array $paths): Option
    {
        foreach ($paths as $path) {
            $refusal = $this->policy->refusalFor($hook->sessionId, $access, $path);

            if ($refusal->isDefined()) {
                return $refusal;
            }
        }

        return None::create();
    }

    /**
     * The words of a shell line split at blanks, quotes and the shell's operators.
     *
     * @return list<string>
     */
    private static function wordsOf(string $line): array
    {
        return preg_split('/[\s;|&<>()`\'"=]+/', $line, -1, PREG_SPLIT_NO_EMPTY) ?: [];
    }

    private function accessOf(CommandPart $part): FileAccess
    {
        return $part->effect->mayChangeFiles() ? FileAccess::Write : FileAccess::Read;
    }
}
