<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Agents\ContainerManifest;
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\SecurityOptions;
use App\Hosts\ArrangementSetting;
use App\Hosts\Exceptions\AccountFolderInvalid;
use App\Hosts\Exceptions\WorkspaceSourceMissing;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Profiles\StartProfiles;
use App\Sessions\Contracts\SessionPolicyReader;
use App\Sessions\Values\SessionContainer;
use App\Values\SelectedAccount;
use Illuminate\Container\Attributes\Config;

/**
 * The container a contained session's start runs in: its frozen policy's image, budgets and access, its workspace,
 * its own account folder and history, its plan's files and its own network, under the agent containers' seccomp
 * profile. A session without a frozen policy that runs in its own container is refused.
 */
final readonly class SessionContainers
{
    public function __construct(
        private SessionPolicyReader $policies,
        private ArrangementSetting $arrangement,
        private StartProfiles $startProfiles,
        #[Config('journal.agents.security_profiles')]
        private string $securityProfiles,
    ) {}

    /**
     * @throws ManifestRefused
     * @throws WorkspaceSourceMissing
     * @throws AccountFolderInvalid
     */
    public function of(AgentRuntime $runtime, SessionProcess $start): SessionContainer
    {
        $sessionId = $runtime->agent_session_id;

        $isOwnContainer = $this->policies->isFrozenFor($sessionId)
            && $this->policies->policyFor($sessionId)->runsInOwnContainer();

        if (! $isOwnContainer) {
            throw ManifestRefused::because(
                'a contained session runs only in its own container, from its frozen policy',
            );
        }

        $policy = $this->policies->policyFor($sessionId);

        $account = new SelectedAccount(
            $start->accountIdentity,
            $runtime->family,
            $start->directory,
            $start->account_generation,
        );

        $manifest = ContainerManifest::compile(
            $sessionId,
            $runtime->canonical_folder,
            $runtime->loadMissing('session')->session->workspaceUse($policy->access),
            $policy->execution->forDriverScreen($runtime->has_screen),
            $this->arrangement->sessionContainerName($sessionId),
            $this->arrangement->mountRules($account, ArrangementSetting::ENVIRONMENT),
            null,
            SecurityOptions::agent($this->securityProfiles),
            $this->startProfiles->for($runtime->family, $account),
        );

        return new SessionContainer($manifest, $this->arrangement->labelsFor($sessionId, $account));
    }
}
