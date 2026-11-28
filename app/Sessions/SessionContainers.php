<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Agents\ContainerManifest;
use App\Agents\Drivers\Enums\StartProfileType;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Enums\WorkspaceUse;
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\SecurityOptions;
use App\Hosts\ArrangementSetting;
use App\Hosts\Exceptions\AccountFolderInvalid;
use App\Hosts\Exceptions\WorkspaceSourceMissing;
use App\Hosts\HelperRuns;
use App\Hosts\Protocol\Payloads\HostContainerRunPayload;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Sessions\Contracts\SessionPolicyReader;
use App\Sessions\Values\SessionContainer;
use App\Support\HelperMounts;
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
        private DriverProfiles $drivers,
        private HelperRuns $runs,
        #[Config('journal.agents.development_programs')]
        private string $developmentPrograms,
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
            $start->account_identity,
            $runtime->family,
            $start->directory,
            $start->account_generation,
        );

        $use = $runtime->loadMissing('session')->session->workspaceUse($policy->access);
        $rules = $this->arrangement->mountRules(
            $account,
            ArrangementSetting::ENVIRONMENT,
            $this->drivers->ofFamily($runtime->family)->containerMounts(),
        );
        // Every driver starts protected: its own user reads the sign-in, the commands its model runs cannot.
        $startProfile = StartProfileType::ProtectedAccount;

        $manifest = ContainerManifest::compile(
            $sessionId,
            $runtime->session->frozenDriverImage(),
            $runtime->canonical_folder,
            $use,
            $policy->execution->forDriverScreen($runtime->has_screen),
            $this->arrangement->sessionContainerName($sessionId),
            $rules,
            null,
            SecurityOptions::agent($this->securityProfiles),
            $startProfile,
            $this->arrangement->labelsFor($sessionId, $account),
        );

        return new SessionContainer($manifest->withDevelopmentPrograms($this->developmentPrograms)->preparedBy([
            ...$this->workspacePreparations($rules, $use, $sessionId),
            ...$this->runs->accountFolderChecks(
                $account->folder(),
                $manifest->accountMountPoints(),
                $manifest->accountScratchPoints(),
            ),
        ]));
    }

    /**
     * The runs that make the workspace ready before the container mounts it: the source checked or filled, and a
     * writer's own checkout cloned from it and checked.
     *
     * @return list<HostContainerRunPayload>
     */
    private function workspacePreparations(HelperMounts $rules, WorkspaceUse $use, string $sessionId): array
    {
        $source = $rules->workspaceSource;

        if ($source === null) {
            return [];
        }

        $prepared = $source->preparations($this->runs);

        if (! $use->isOwnCheckout()) {
            return $prepared;
        }

        return [
            ...$prepared,
            ...$this->runs->writerCheckout($source->mount(false), $rules->checkoutVolume($sessionId)),
        ];
    }
}
