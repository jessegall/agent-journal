<?php

declare(strict_types=1);

namespace App\Commands\ClaimStartGrant;

use App\Contracts\Bus\CommandHandler;
use App\Events\StartGrantRequested;
use App\Exceptions\AccountFolderInvalid;
use App\Exceptions\ManifestRefused;
use App\Exceptions\WorkspaceSourceMissing;
use App\Support\HostRuntimes;
use App\Support\OfflineReplySeal;
use App\Support\RuntimeStart;
use App\Support\SessionContainers;
use App\Support\StartAdditions;
use App\Support\StartExtensionRequests;
use App\Support\StartGrant;
use App\Support\StartProfilePin;

final readonly class ClaimStartGrantHandler implements CommandHandler
{
    public function __construct(
        private HostRuntimes $runtimes,
        private StartExtensionRequests $extensions,
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
    public function handle(ClaimStartGrantCommand $command): StartGrant|null
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);
        $token = $runtime->claimStartGrant();

        if ($token === null) {
            return null;
        }

        $additions = new StartAdditions();
        $this->extensions->grantAdditions(new StartGrantRequested($runtime->agent_session_id, $additions));

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
