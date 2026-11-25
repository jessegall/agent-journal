<?php

declare(strict_types=1);

namespace Tests\Support\Sharing;

use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Support\ShareGrant;
use Domain\Sharing\Support\ShareToken;
use Tests\Support\TestIds;

/**
 * Grants shares the way the sharing tests do: owned by test user 9, the journal's owner there, for a day.
 */
final class TestShares
{
    public const int OWNER = 9;

    public static function grantForADay(RecordIdentity $root, ShareGatewayConfiguration $configuration): Share
    {
        return Share::create(
            $root,
            CarbonImmutable::now()->addDay(),
            new ShareGrant(
                TestIds::of(self::OWNER),
                $configuration->id,
                $configuration->configuration_version,
                ShareToken::generate(),
            ),
        );
    }
}
