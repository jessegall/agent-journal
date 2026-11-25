<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Fixtures;

use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareMember;
use Domain\Sharing\Support\ShareGrant;
use Domain\Sharing\Support\ShareToken;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\TestJournal;

/**
 * Shares the journal's owner granted, kept under the names a test gives them: each grant has a token of its own and
 * the gateway configuration and version it was made under, and starts pending.
 */
final class ShareFixtures
{
    private readonly FixtureAliases $aliases;

    public function __construct(private readonly TestJournal $journal)
    {
        $this->aliases = new FixtureAliases('ShareFixtures');
    }

    public function grantUntil(
        string $name,
        RecordIdentity $root,
        ShareGatewayConfiguration $configuration,
        CarbonImmutable $expiresAt,
    ): self {
        $this->aliases->claim($name);
        $grant = new ShareGrant(
            $this->journal->ownerUser()->id,
            $configuration->id,
            $configuration->configuration_version,
            ShareToken::generate(),
        );
        $this->aliases->remember($name, Share::create($root, $expiresAt, $grant));

        return $this;
    }

    /**
     * A grant that ends a day after the application's now, which a test moves with travelTo.
     */
    public function grantForADay(string $name, RecordIdentity $root, ShareGatewayConfiguration $configuration): self
    {
        return $this->grantUntil($name, $root, $configuration, CarbonImmutable::now()->addDay());
    }

    public function shareCalled(string $name): Share
    {
        return $this->aliases->model(Share::class, $name);
    }

    public function assertGrant(
        string $name,
        RecordIdentity $root,
        string $owner,
        CarbonImmutable $expiresAt,
        int $configurationVersion,
        ShareStatus $status = ShareStatus::Pending,
    ): self {
        $share = $this->shareCalled($name);

        Assert::assertSame(
            [$root->type, $root->id, $this->journal->userCalled($owner)->id, $configurationVersion, $status],
            [$share->root_type, $share->root_id, $share->owner_user_id, $share->configuration_version, $share->status],
            "The share {$name} was granted otherwise.",
        );
        Assert::assertTrue($expiresAt->equalTo($share->expires_at), "The share {$name} ends at another time.");

        return $this;
    }

    /**
     * The record is a current member of the share.
     */
    public function assertMember(string $name, RecordIdentity $member): self
    {
        $members = ShareMember::query()
            ->where('share_id', $this->shareCalled($name)->id)
            ->whereNull('invalidated_at')
            ->where('target_type', $member->type)
            ->where('target_id', $member->id)
            ->count();

        Assert::assertSame(1, $members, "{$member->reference()} is no current member of the share {$name}.");

        return $this;
    }

    public function assertRevoked(string $name): self
    {
        $share = $this->shareCalled($name);

        Assert::assertSame(ShareStatus::Revoked, $share->status, "The share {$name} was not revoked.");
        Assert::assertFalse($share->isReadableNow(), "The share {$name} can still be read.");

        return $this;
    }
}
