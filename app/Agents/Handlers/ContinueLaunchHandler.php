<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ContinueLaunch;
use App\Agents\Commands\LaunchAgent;
use App\Agents\Contracts\SessionPolicyReader;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Exceptions\LaunchRefused;
use App\Agents\Models\AgentSession;
use App\Agents\Support\LaunchReceipt;
use App\Agents\Support\LaunchRequest;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use Symfony\Component\Uid\Ulid;

/**
 * Builds the successor's launch from the session it continues: the same agent, program, model and parent, the policy
 * frozen with the old session, and a request id made from the old session's id, so a repeated or concurrent Continue
 * finds the launch already made. The launch itself picks the account chosen now.
 */
final readonly class ContinueLaunchHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands, private SessionPolicyReader $policies) {}

    public function handle(ContinueLaunch $command): LaunchReceipt
    {
        $predecessor = AgentSession::query()
            ->whereKey($command->sessionId)
            ->where('agent_id', $command->agentId)
            ->first();

        if ($predecessor === null) {
            throw LaunchRefused::withoutPredecessor($command->sessionId);
        }

        return $this->commands->run(new LaunchAgent(new LaunchRequest(
            self::successorRequestId($predecessor),
            $predecessor->agent_id,
            $predecessor->selection(),
            LaunchOriginType::MainLaunch,
            null,
            $predecessor->id,
            ConversationModeType::New,
            $predecessor->parent_session_id,
            $this->policies->policyFor($predecessor->id),
        )));
    }

    /**
     * The successor's request id: a ULID made from the predecessor's id, the same for every Continue of it.
     */
    private static function successorRequestId(AgentSession $predecessor): string
    {
        $bytes = substr(hash('sha256', 'continue '.$predecessor->id, true), 0, 16);

        return strtolower(Ulid::fromBinary($bytes)->toBase32());
    }
}
