<?php

declare(strict_types=1);

namespace Tests\Unit\Sharing;

use App\CoreApi;
use App\Sharing\Models\Share;
use App\Sharing\Support\OwnerSharePolicy;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;
use App\Sharing\Support\ShareToken;
use Tests\TestCase;

/**
 * Core's exports carry the sharing seams: a domain implements Shareable, ShareRecordContributor, a provider and a gateway
 * through exported names alone, while models, registries, the owner policy and tokens stay private.
 */
final class SharingExportsTest extends TestCase
{
    public function test_the_fixture_sharing_domain_names_only_exported_sharing_and_record_classes(): void
    {
        $exports = CoreApi::exports();
        $named = [];

        foreach (glob(dirname(__DIR__, 2).'/Fixtures/Domains/Pamphlets/*.php') ?: [] as $file) {
            preg_match_all(
                '/^use (App\\\\(?:Sharing|Records)\\\\[A-Za-z\\\\]+);/m',
                (string) file_get_contents($file),
                $imports,
            );
            array_push($named, ...$imports[1]);
        }

        $named = array_values(array_unique($named));

        $this->assertContains('App\\Sharing\\Contracts\\Shareable', $named);
        $this->assertContains('App\\Sharing\\Contracts\\ShareRecordContributor', $named);
        $this->assertSame([], array_values(array_filter($named, fn (string $name) => ! $exports->has($name))));
    }

    public function test_models_registries_the_owner_policy_and_tokens_stay_private(): void
    {
        $exports = CoreApi::exports();

        foreach ([
            Share::class,
            ShareRecordRegistry::class,
            ShareGatewayRegistry::class,
            OwnerSharePolicy::class,
            ShareToken::class,
        ] as $private) {
            $this->assertFalse($exports->has($private), "{$private} is exported.");
        }
    }
}
