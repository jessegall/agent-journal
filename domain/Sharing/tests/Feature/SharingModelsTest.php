<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use App\Support\GatewaySettings;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareInstallation;
use Domain\Sharing\Support\ShareGrant;
use Domain\Sharing\Support\ShareToken;
use Domain\Sharing\Tests\Support\SelectsShareTargets;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;

/**
 * The sharing tables and models: the create migrations make all eight tables, each model is made through its own
 * methods, and a share never serializes its token columns while the token itself is stored encrypted.
 */
final class SharingModelsTest extends TestCase
{
    use RefreshHookDatabase;
    use SelectsShareTargets;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_the_installation_row_is_made_once_and_locked_for_admission(): void
    {
        $first = DB::transaction(fn () => ShareInstallation::create());
        $second = DB::transaction(fn () => ShareInstallation::create());

        $this->assertSame($first->id, $second->id);
        $this->assertSame(1, ShareInstallation::query()->readAll('the installation has one row')->count());
    }

    public function test_a_share_never_serializes_its_token_and_stores_it_encrypted(): void
    {
        $token = ShareToken::generate();
        $share = Share::create(
            $this->root(),
            CarbonImmutable::now()->addDays(7),
            new ShareGrant(
                $this->journal->ownerUser()->id,
                $this->configuration()->id,
                $this->configuration()->configuration_version,
                $token,
            ),
        );
        $stored = Share::query()->findOrFail($share->id);

        $this->assertSame(ShareStatus::Pending, $stored->status);
        $this->assertArrayNotHasKey('token_digest', $stored->toArray());
        $this->assertArrayNotHasKey('token_ciphertext', $stored->toArray());
        $this->assertStringNotContainsString($token->token, $stored->toJson());
        $this->assertSame($token->token, $stored->token_ciphertext);
        $this->assertNotSame($token->token, $stored->getRawOriginal('token_ciphertext'));
        $this->assertSame(ShareToken::digestOf($token->token), $stored->token_digest);
    }

    private function root(): RecordIdentity
    {
        return TestActors::record('documents.document', 1);
    }

    private function configuration(): ShareGatewayConfiguration
    {
        return ShareGatewayConfiguration::create(
            new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, ['press-login']),
        );
    }
}
