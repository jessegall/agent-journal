<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Time\ServerClock;
use App\Data\Terminals\TerminalControlData;
use App\Data\Terminals\TerminalFrameData;
use App\Enums\Agents\AccessType;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\TerminalControlRefused;
use App\Exceptions\TerminalViewRefused;
use App\Models\Agents\Agent;
use App\Policies\AgentMaintenancePolicy;

/**
 * The current viewer's reads of an agent's terminal, its frames and their control of it, with inspect decided on
 * every read as the view commands decide it.
 */
final readonly class TerminalFrames
{
    public function __construct(
        private CurrentActor $actor,
        private CurrentAuthorizer $authorizer,
        private TerminalViewCloser $views,
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
