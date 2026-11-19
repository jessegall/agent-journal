<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\ServerClock;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorIdentity;
use App\Agents\Data\TerminalFrameData;
use App\Agents\Enums\AgentAbility;
use App\Agents\Exceptions\TerminalViewRefused;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use PhpOption\Option;

/**
 * The current viewer's read of an agent's terminal frames, with inspect decided on every read as the view commands
 * decide it.
 */
final readonly class TerminalFrames
{
    public function __construct(
        private CurrentActor $actor,
        private CurrentAuthorizer $authorizer,
        private TerminalViews $views,
        private ServerClock $clock,
    ) {}

    /**
     * @return Option<TerminalFrameData>
     *
     * @throws ActorNotAllowed
     * @throws TerminalViewRefused
     */
    public function after(string $agentId, string $epoch, int $sequence): Option
    {
        $this->authorizer->authorize(AgentPolicy::class, Agent::class, AgentAbility::Inspect);
        $viewer = ActorIdentity::of($this->actor->actor());

        return $this->views->frame($agentId, $viewer, $epoch, $sequence, $this->clock->now());
    }
}
