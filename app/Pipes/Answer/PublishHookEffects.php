<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\Pipe;
use App\Support\CallStages\SettledCall;
use App\Support\CallStages\WalkedCall;
use App\Support\Stack\StateCommandPublisher;

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
