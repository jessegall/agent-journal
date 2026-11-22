<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Command;
use App\Contracts\CommandFacts;
use App\Contracts\CurrentActor;
use App\Contracts\Pipe;
use App\Events\HookCommandAnswered;
use App\Support\CallStages\SettledCall;
use App\Support\CallStages\WalkedCall;

/**
 * Publishes the commands and events the states answered the hook with, in their order, to be heard once the hook
 * commits; a command runs under the hook's actor and authority.
 */
final readonly class PublishHookEffects implements Pipe
{
    public function __construct(private CommandFacts $facts, private CurrentActor $actors) {}

    public function handle(WalkedCall $walked): SettledCall
    {
        foreach ($walked->answer->effects as $effect) {
            if ($effect instanceof Command) {
                $this->facts->publishAfterCommit(new HookCommandAnswered(
                    $walked->call->target,
                    $effect,
                    $this->actors->actor(),
                    $this->actors->authority(),
                ));
            } else {
                $this->facts->publishAfterCommit($effect);
            }
        }

        return $walked->settled();
    }
}
