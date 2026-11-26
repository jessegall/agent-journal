<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\Pipe;
use App\Hooks\CallStages\SettledCall;
use App\Hooks\CallStages\WalkedCall;
use App\Stacks\StateCommandPublisher;

/**
 * Publishes the commands and events the states answered the hook with, in their order, to be heard once the hook
 * commits; a command runs under the hook's actor and authority.
 */
final readonly class PublishHookEffects implements Pipe
{
    public function __construct(private CommandFacts $facts, private StateCommandPublisher $stateCommands) {}

    public function handle(WalkedCall $walked): SettledCall
    {
        foreach ($walked->answer->effects as $effect) {
            if ($effect instanceof Command) {
                $this->stateCommands->publish($walked->call->target, $effect);
            } else {
                $this->facts->publishAfterCommit($effect);
            }
        }

        return $walked->settled();
    }
}
