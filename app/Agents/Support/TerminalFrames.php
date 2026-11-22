<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\ServerClock;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorIdentity;
use App\Agents\Data\TerminalFrameData;
use App\Agents\Exceptions\TerminalViewRefused;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Operations\Enums\AccessType;
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
    public function after(string $agentId, string $readInterestId, string $epoch, int $sequence): Option
    {
        $viewer = $this->inspectingViewer();

        return $this->views->frame($agentId, $viewer, $readInterestId, $epoch, $sequence, $this->clock->now());
    }

    /**
     * The id of the read interest the current viewer's open request opened.
     *
     * @throws ActorNotAllowed
     * @throws TerminalViewRefused
     */
    public function interestOpenedBy(string $agentId, string $openRequestId): string
    {
        return $this->views->interestOpenedBy($agentId, $this->inspectingViewer(), $openRequestId);
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
