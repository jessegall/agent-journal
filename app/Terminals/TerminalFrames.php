<?php

declare(strict_types=1);

namespace App\Terminals;

use App\Access\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\CurrentActor;
use App\Agents\Enums\AccessType;
use App\Exceptions\ActorNotAllowed;
use App\Models\Agents\Agent;
use App\Policies\AgentMaintenancePolicy;
use App\Support\ActorReference;
use App\Terminals\Data\TerminalControlData;
use App\Terminals\Data\TerminalFrameData;
use App\Terminals\Exceptions\TerminalControlRefused;
use App\Terminals\Exceptions\TerminalViewRefused;
use App\Time\Contracts\ServerClock;

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
    private function inspectingViewer(): ActorReference
    {
        $this->authorizer->authorize(AgentMaintenancePolicy::class, Agent::class, AccessType::Read);

        return $this->actor->actor();
    }
}
