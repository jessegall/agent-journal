<?php

declare(strict_types=1);

namespace App\Support\Drivers\Adapters;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Authorization\FileAccessPolicy;
use App\Enums\Files\FileAccess;
use App\Support\Drivers\Contracts\DriverCall;
use App\Support\Drivers\DriverReplies;
use App\Support\Inputs\Values\HookIdentity;
use App\Values\AgentText;
use App\Values\CommandPart;
use App\Values\ShellCommand;
use Closure;
use PhpOption\None;
use PhpOption\Option;

/**
 * Puts a tool's files before the file access policy: the first refused file denies the tool call without asking any
 * state, and a call whose files all pass goes on as the adapter built it.
 */
final readonly class GuardedFiles
{
    public function __construct(private FileAccessPolicy $policy, private AgentTexts $texts) {}

    /**
     * @param  list<string>  $paths
     * @param  Closure(): DriverCall  $call
     */
    public function callUnlessRefused(HookIdentity $hook, FileAccess $access, array $paths, Closure $call): DriverCall
    {
        return $this->firstRefusal($hook, $access, $paths)
            ->map(fn (AgentText $refusal): DriverCall => new UnjudgedCall(
                DriverReplies::denyTool($this->texts->render($refusal), []),
            ))
            ->getOrCall($call);
    }

    /**
     * A shell line's every argument, judged as a write in a part that may change files and as a read in any other. A
     * line the parser could not read fully has no trusted parts, so each word of its text is judged as a write.
     *
     * @param  Closure(): DriverCall  $call
     */
    public function guardShell(HookIdentity $hook, ShellCommand $command, Closure $call): DriverCall
    {
        if (! $command->outcome->isComplete()) {
            return $this->callUnlessRefused($hook, FileAccess::Write, self::wordsOf($command->source), $call);
        }

        foreach ($command->parts as $part) {
            $refusal = $this->firstRefusal($hook, $this->accessOf($part), $part->arguments);

            if ($refusal->isDefined()) {
                return new UnjudgedCall(DriverReplies::denyTool($this->texts->render($refusal->get()), []));
            }
        }

        return $call();
    }

    /**
     * @param  list<string>  $paths
     * @return Option<AgentText>
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
        $words = preg_split('/[\s;|&<>()`\'"=]+/', $line, -1, PREG_SPLIT_NO_EMPTY);

        if ($words === false) {
            return [];
        }

        return $words;
    }

    private function accessOf(CommandPart $part): FileAccess
    {
        if ($part->effect->changesFiles()) {
            return FileAccess::Write;
        }

        return FileAccess::Read;
    }
}
