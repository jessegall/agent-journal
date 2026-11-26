<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Sharing\Enums\ShareStatus;
use App\Sharing\Support\ShareGrant;
use App\Sharing\Support\ShareToken;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\TestProjects;

/**
 * Shares the journal's owner granted, kept under the names a test gives them: each grant has a token of its own and
 * the gateway configuration and version it was made under, and starts pending.
 */
trait ArrangesShares
{
    /**
     * @var array<string, string> each share's id by its name
     */
    private array $shareIds = [];

    public function shareUntil(
        string $name,
        RecordIdentity $root,
        ShareGatewayConfiguration $configuration,
        CarbonImmutable $expiresAt,
    ): self {
        if (array_key_exists($name, $this->shareIds)) {
            throw FixtureRefused::occupiedAlias($name, Share::class);
        }

        $grant = new ShareGrant(
            $this->ownerUser()->id,
            $configuration->id,
            $configuration->configuration_version,
            ShareToken::generate(),
        );

        $this->shareIds[$name] = Share::create($root, TestProjects::localOwner(), $expiresAt, $grant)->id;

        return $this;
    }

    /**
     * A grant that ends a day after the application's now, which a test moves with travelTo.
     */
    public function shareForADay(string $name, RecordIdentity $root, ShareGatewayConfiguration $configuration): self
    {
        return $this->shareUntil($name, $root, $configuration, CarbonImmutable::now()->addDay());
    }

    /**
     * The named share's gateway serves it now, as after the gateway reported it open.
     */
    public function activateShare(string $name): self
    {
        $this->shareCalled($name)->activate();

        return $this;
    }

    public function shareCalled(string $name): Share
    {
        $id = $this->shareIds[$name] ?? throw FixtureRefused::missingAlias('share', $name, self::OWNER);

        return Share::findById($id)->get();
    }

    public function assertShare(
        string $name,
        RecordIdentity $root,
        string $owner,
        CarbonImmutable $expiresAt,
        int $configurationVersion,
        ShareStatus $status = ShareStatus::Pending,
    ): self {
        $share = $this->shareCalled($name);

        Assert::assertSame(
            [$root->type, $root->id, $this->userCalled($owner)->id, $configurationVersion, $status],
            [$share->root_type, $share->root_id, $share->owner_user_id, $share->configuration_version, $share->status],
            "The share {$name} was granted otherwise.",
        );

        Assert::assertTrue($expiresAt->equalTo($share->expires_at), "The share {$name} ends at another time.");

        return $this;
    }
}
