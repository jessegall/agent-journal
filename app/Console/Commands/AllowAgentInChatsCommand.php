<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Support\ActorIdentity;
use App\Support\AgentChatAccess;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;

final class AllowAgentInChatsCommand extends Command
{
    protected $signature = 'agents:chat-allow
        {agent : The id of the agent}
        {--environment= : The environment id; this installation when left out}
        {--inviter=* : The id of a user who may invite the agent, once per user}
        {--withdraw : Withdraw the agent from the chats of the environment instead}';

    protected $description = 'Allow an agent into chats of an environment for the users named, or withdraw it';

    public function handle(AgentChatAccess $access): int
    {
        $agentId = (string) $this->argument('agent');
        $environmentId = $this->option('environment');
        $environment = is_string($environmentId) && $environmentId !== '' ? $environmentId : null;
        $now = CarbonImmutable::now();

        if ($this->option('withdraw') === true) {
            $access->withdraw($agentId, $environment, $now);
            $this->info("Withdrew agent {$agentId} from its chats.");

            return self::SUCCESS;
        }

        $inviters = array_values(array_map(strval(...), (array) $this->option('inviter')));
        $access->allow($agentId, $environment, $inviters, ActorIdentity::system(), $now);
        $this->info("Allowed agent {$agentId} in chats for ".count($inviters).' inviter(s).');

        return self::SUCCESS;
    }
}
