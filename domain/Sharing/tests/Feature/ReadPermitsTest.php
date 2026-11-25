<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use App\Contracts\Reads\ReadMeter;
use App\Exceptions\ReadPermitMissing;
use App\Support\GatewaySettings;
use Carbon\CarbonImmutable;
use Domain\Sharing\Exceptions\ShareLinkRefused;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Support\ReadPermits;
use Domain\Sharing\Support\ShareGrant;
use Domain\Sharing\Support\ShareToken;
use Domain\Sharing\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;

/**
 * Read permits: a valid token yields a permit taken once by its reference, an expired share still yields one so its
 * denial can be recorded, a malformed token is refused before any query, and nothing names the token.
 */
final class ReadPermitsTest extends TestCase
{
    use RefreshHookDatabase;

    private ShareToken $token;

    private Share $share;

    protected function setUp(): void
    {
        parent::setUp();

        $this->token = ShareToken::generate();
        $configuration = ShareGatewayConfiguration::create(
            new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []),
        );
        $this->share = Share::create(
            TestActors::record('documents.document', 1),
            CarbonImmutable::now()->subMinute(),
            new ShareGrant(TestIds::of(9), $configuration->id, $configuration->configuration_version, $this->token),
        );
    }

    public function test_a_valid_token_yields_a_permit_taken_once_even_for_an_expired_share(): void
    {
        $permits = $this->app->make(ReadPermits::class);

        $permit = $permits->issue($this->token->token);

        $this->assertSame([
            $this->share->id,
            Share::FIRST_SCOPE_VERSION,
        ], [
            $permit->shareId,
            $permit->scopeVersion,
        ]);
        $this->assertSame($permit, $permits->take($permit->reference));
        $this->assertThrows(fn () => $permits->take($permit->reference), ReadPermitMissing::class);
    }

    public function test_clear_empties_the_store(): void
    {
        $permits = $this->app->make(ReadPermits::class);
        $permit = $permits->issue($this->token->token);

        $permits->clear();

        $this->assertThrows(fn () => $permits->take($permit->reference), ReadPermitMissing::class);
    }

    public function test_a_malformed_token_is_refused_without_a_query(): void
    {
        $permits = $this->app->make(ReadPermits::class);

        $measured = $this->app->make(ReadMeter::class)->measure('issue', function () use ($permits): string {
            try {
                $permits->issue('not-a-token');
            } catch (ShareLinkRefused $refused) {
                return $refused->getMessage();
            }

            return 'issued';
        });

        $this->assertSame(ShareLinkRefused::unknown()->getMessage(), $measured->measuredAnswer);
        $this->assertSame(0, $measured->counts->queriesRun);
    }

    public function test_an_unknown_token_is_refused_without_naming_it_or_writing_an_audit_row(): void
    {
        $unknown = ShareToken::generate()->token;

        try {
            $this->app->make(ReadPermits::class)->issue($unknown);
            $this->fail('An unknown token yielded a permit.');
        } catch (ShareLinkRefused $refused) {
            $this->assertStringNotContainsString($unknown, $refused->getMessage());
        }

        $this->assertSame(0, ShareAudit::query()->count());
        $this->assertSame(43, strlen($this->token->token));
    }

    public function test_a_permit_is_never_serialized(): void
    {
        $permit = $this->app->make(ReadPermits::class)->issue($this->token->token);

        $this->expectException(ReadPermitMissing::class);

        serialize($permit);
    }
}
