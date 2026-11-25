<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sessions\SessionPolicyReader;
use App\Exceptions\AccountFolderInvalid;
use App\Exceptions\ManifestRefused;
use App\Exceptions\WorkspaceSourceMissing;
use App\Models\Agents\AgentRuntime;
use App\Models\Starts\ProcessStart;
use App\Values\SelectedAccount;

/**
 * The container a runtime's session runs in, compiled when the host takes its start grant: its frozen policy's image,
 * budgets and access, the workspace its environment's source gives (a writing helper's own clone of it), its own
 * account folder and history, and its own network, all named for the installation and the session. A session that
 * runs on the protected host, or one opened without a frozen policy, has none.
 */
final readonly class SessionContainers
{
    public function __construct(
        private SessionPolicyReader $policies,
        private ArrangementSetting $arrangement,
        private LaunchProfiles $launchProfiles,
    ) {}

    /**
     * @throws ManifestRefused
     * @throws WorkspaceSourceMissing
     * @throws AccountFolderInvalid
     */
    public function manifestOf(AgentRuntime $runtime): ContainerManifest|null
    {
        if (! $this->policies->isFrozenFor($runtime->agent_session_id)) {
            return null;
        }

        $policy = $this->policies->policyFor($runtime->agent_session_id);

        if (! $policy->runsInOwnContainer()) {
            return null;
        }

        $account = $this->accountOf($runtime);

        $rules = $this->arrangement->mountRules(
            $account,
            ArrangementSetting::ENVIRONMENT,
        );

        return ContainerManifest::compile(
            $runtime->agent_session_id,
            $runtime->canonical_folder,
            $runtime->session->workspaceUse($policy->access),
            $policy->execution->forDriverScreen($runtime->has_screen),
            $this->arrangement->sessionContainerName($runtime->agent_session_id),
            $rules,
            null,
            $this->launchProfiles->for($runtime->family, $account),
        );
    }

    /**
     * The saved account the session's start signs in with, as its process start recorded it; none for a start
     * without one.
     */
    private function accountOf(AgentRuntime $runtime): SelectedAccount|null
    {
        $start = ProcessStart::currentOf($runtime->agent_session_id);

        if ($start === null) {
            return null;
        }

        return new SelectedAccount(
            $start->accountIdentity,
            $runtime->family,
            $start->directory,
            $start->account_generation,
        );
    }
}
