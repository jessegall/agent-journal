<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Contracts\FileAccessPolicy;
use App\Hooks\Contracts\ProgramCall;
use App\Hooks\Enums\FileAccess;
use App\Hooks\Inputs\HookIdentity;
use Closure;

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
    public function callUnlessRefused(HookIdentity $hook, FileAccess $access, array $paths, Closure $call): ProgramCall
    {
        foreach ($paths as $path) {
            $refusal = $this->policy->refusalFor($hook->sessionId, $access, $path);

            if ($refusal->isDefined()) {
                return new UnjudgedCall(ProgramReplies::denyTool($refusal->get(), []));
            }
        }

        return $call();
    }
}
