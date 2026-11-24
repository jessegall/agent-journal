<?php

declare(strict_types=1);

namespace App\Commands\ContinueStart;

use App\Commands\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Sessions\BuiltInStartProfiles;
use App\Contracts\Sessions\SessionPolicyReader;
use App\Enums\ConversationModeType;
use App\Enums\DriverVariant;
use App\Enums\StartOriginType;
use App\Exceptions\StartRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Support\StartReceipt;
use App\Values\StartRequest;
use Symfony\Component\Uid\Ulid;

/**
 * Builds the successor's start from the session it continues: the same agent, driver, model and parent, the policy
 * frozen with the old session, and a request id made from the old session's id, so a repeated or concurrent Continue
 * finds the start already made. The start itself picks the account chosen now.
 */
final readonly class ContinueStartHandler implements CommandHandler
{
    public function __construct(
        private CommandBus $commands,
        private SessionPolicyReader $policies,
        private BuiltInStartProfiles $profiles,
    ) {}

    public function handle(ContinueStartCommand $command): StartReceipt
    {
        $predecessor = AgentSession::query()
            ->whereKey($command->sessionId)
            ->where('agent_id', $command->agentId)
            ->first();

        if ($predecessor === null) {
            throw StartRefused::withoutPredecessor($command->sessionId);
        }

        return $this->commands->run(new StartAgentCommand(new StartRequest(
            self::successorRequestId($predecessor),
            $predecessor->agent_id,
            $predecessor->selection,
            StartOriginType::MainStart,
            null,
            $predecessor->id,
            ConversationModeType::New,
            $predecessor->parent_session_id,
            $this->policies->policyFor($predecessor->id),
            variant: $this->modeOf($predecessor),
        )));
    }

    /**
     * The successor runs in its predecessor's mode; one that ran no runtime takes the agent's own choice.
     */
    private function modeOf(AgentSession $predecessor): DriverVariant
    {
        $runtime = AgentRuntime::ofSession($predecessor->id);

        if ($runtime !== null) {
            return $runtime->mode;
        }

        $agent = Agent::query()->findOrFail($predecessor->agent_id);

        return $agent->variantFor(null, $this->profiles->defaultVariantOf($agent->profile_key));
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
