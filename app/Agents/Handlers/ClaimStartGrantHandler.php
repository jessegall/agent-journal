<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\AgentRequests\Support\StartProfilePin;
use App\Agents\Commands\ClaimStartGrant;
use App\Agents\Events\StartGrantRequested;
use App\Agents\Exceptions\AccountFolderInvalid;
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\Exceptions\WorkspaceSourceMissing;
use App\Agents\Support\HostRuntimes;
use App\Agents\Support\OfflineReplySeal;
use App\Agents\Support\RuntimeStart;
use App\Agents\Support\SessionContainers;
use App\Agents\Support\StartAdditions;
use App\Agents\Support\StartGrant;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class ClaimStartGrantHandler implements CommandHandler
{
    public function __construct(
        private HostRuntimes $runtimes,
        private Dispatcher $events,
        private OfflineReplySeal $seal,
        private SessionContainers $containers,
    ) {}

    /**
     * The grant once, with what the other areas add to the start and the container a contained session runs in; a
     * listener's refusal, or a manifest the session's arrangement refuses, rolls the claim back, so the host may ask
     * again once the start is ready.
     *
     * @throws ManifestRefused
     * @throws WorkspaceSourceMissing
     * @throws AccountFolderInvalid
     */
    public function handle(ClaimStartGrant $command): StartGrant|null
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);
        $token = $runtime->claimStartGrant();

        if ($token === null) {
            return null;
        }

        $additions = new StartAdditions();
        $this->events->dispatch(new StartGrantRequested($runtime->agent_session_id, $additions));

        $session = $runtime->load('session')->session;
        $pin = new StartProfilePin((string) $session->profile_key, (int) $session->profile_revision);

        return new StartGrant(
            $token,
            $additions->folders(),
            $session->profile_key,
            $session->profile_revision,
            $additions->offlineReply(),
            $this->seal->seal($token, $pin, $additions->offlineReply()),
            RuntimeStart::of($runtime),
            $this->containers->manifestOf($runtime),
        );
    }
}
