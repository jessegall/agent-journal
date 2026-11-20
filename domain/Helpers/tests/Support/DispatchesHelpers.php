<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Support;

use App\Agents\Contracts\HelperImages;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Models\AgentSession;
use App\Agents\Models\StartRecord;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;
use App\Agents\Support\HostCapacity;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Values\ProfileBase;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Helpers\Commands\StartHelper;
use Domain\Helpers\Support\HelperReceipt;
use Domain\Helpers\Support\HelperWork;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\WithActiveAccount;

/**
 * A parent session with an activated read-only helper profile on a host that supports containers, and the start of a
 * helper job through StartHelper, for the tests that dispatch helpers.
 */
trait DispatchesHelpers
{
    use WithActiveAccount;

    private TestStart $parent;

    protected function setUpDispatchesHelpers(): void
    {
        $this->chooseActiveAccounts();
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->supportContainers();
        $this->app->make(CommandBus::class)->run(new ActivateProfiles(TestProposals::of(
            TestProposals::profile('plan-reviewer', ProfileBase::readOnlyHelper()),
            TestProposals::profile('journal-main', ProfileBase::mainAgent()),
        )));
        $this->parent = TestStart::start();
        $this->parent->startRequest($this->app);
        $this->supportContainers();
    }

    private function start(
        string $requestId,
        string $purpose,
        string $brief = 'Review it.',
        string $profileKey = 'plan-reviewer',
    ): HelperReceipt {
        return $this->app->make(CommandBus::class)->run(new StartHelper(
            $requestId,
            $profileKey,
            'default',
            null,
            new HelperWork(null, null, $purpose, $brief, [], false),
        ));
    }

    private function endSessionOf(HelperReceipt $receipt): void
    {
        $sessionId = StartRecord::query()->where('request_id', $receipt->start->launchReference)->sole()->session_id;
        AgentSession::query()->findOrFail($sessionId)->endAt(CarbonImmutable::now());
    }

    private function supportContainers(): void
    {
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                return new HostCapability(
                    $query,
                    CapabilityStatusType::Supported,
                    'docs/x.md',
                    'Proven for this test.',
                );
            }
        });
        $this->app->instance(HelperImages::class, new class implements HelperImages
        {
            public function isVerified(string $imageReference): bool
            {
                return true;
            }
        });
        $this->app->instance(HostCapacity::class, new HostCapacity(8, 64 * 1024 ** 3, 500 * 1024 ** 3));
    }
}
