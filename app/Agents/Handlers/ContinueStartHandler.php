<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ContinueStart;
use App\Agents\Commands\StartAgent;
use App\Agents\Contracts\SessionPolicyReader;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Exceptions\StartRefused;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StartReceipt;
use App\Agents\Values\StartRequest;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use Symfony\Component\Uid\Ulid;

/**
 * Builds the successor's start from the session it continues: the same agent, driver, model and parent, the policy
 * frozen with the old session, and a request id made from the old session's id, so a repeated or concurrent Continue
 * finds the start already made. The start itself picks the account chosen now.
 */
final readonly class ContinueStartHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands, private SessionPolicyReader $policies) {}

    public function handle(ContinueStart $command): StartReceipt
    {
        $predecessor = AgentSession::query()
            ->whereKey($command->sessionId)
            ->where('agent_id', $command->agentId)
            ->first();

        if ($predecessor === null) {
            throw StartRefused::withoutPredecessor($command->sessionId);
        }

        return $this->commands->run(new StartAgent(new StartRequest(
            self::successorRequestId($predecessor),
            $predecessor->agent_id,
            $predecessor->selection(),
            StartOriginType::MainStart,
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
