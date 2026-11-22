<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\ServerClock;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorIdentity;
use App\Agents\Data\TerminalControlData;
use App\Agents\Data\TerminalFrameData;
use App\Agents\Exceptions\TerminalControlRefused;
use App\Agents\Exceptions\TerminalViewRefused;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Operations\Enums\AccessType;

/**
 * The current viewer's reads of an agent's terminal, its frames and their control of it, with inspect decided on
 * every read as the view commands decide it.
 */
final readonly class TerminalFrames
{
    public function __construct(
        private CurrentActor $actor,
        private CurrentAuthorizer $authorizer,
        private TerminalViews $views,
        private TerminalControls $controls,
        private ServerClock $clock,
    ) {}

    /**
     * What the current viewer's read interest should see after the frame it holds.
     *
     * @throws ActorNotAllowed
     * @throws TerminalViewRefused
     */
    public function after(string $agentId, HeldFrame $held): TerminalFrameData
    {
        return $this->views->frame($agentId, $this->inspectingViewer(), $held, $this->clock->now());
    }

    /**
     * The current viewer's take of the agent's terminal and what became of the input at the sequence, when asked.
     *
     * @throws ActorNotAllowed
     * @throws TerminalControlRefused
     */
    public function control(string $takeId, int $sequence): TerminalControlData
    {
        return $this->controls->receipt($this->inspectingViewer(), $takeId, $sequence, $this->clock->now());
    }

    /**
     * @throws ActorNotAllowed
     */
    private function inspectingViewer(): ActorIdentity
    {
        $this->authorizer->authorize(AgentMaintenancePolicy::class, Agent::class, AccessType::Read);

        return ActorIdentity::of($this->actor->actor());
    }
}
