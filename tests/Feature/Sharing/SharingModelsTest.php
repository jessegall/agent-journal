<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Records\Support\RecordIdentity;
use App\Sharing\Enums\GatewayEndpointState;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Models\ShareMember;
use App\Sharing\Models\SharePreview;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\ShareSelectedTarget;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The sharing tables and models: the create migrations make all eight tables, each model is made through its own
 * methods, and a share never serializes its token columns while the token itself is stored encrypted.
 */
final class SharingModelsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_create_migrations_make_the_eight_sharing_tables(): void
    {
        foreach (['share_installations', 'share_previews', 'shares', 'share_members', 'share_gateway_configurations', 'share_gateway_endpoints', 'share_gateway_operations', 'share_audits'] as $table) {
            $this->assertTrue(Schema::hasTable($table), "{$table} is missing.");
        }
    }

    public function test_the_installation_row_is_made_once_and_locked_for_admission(): void
    {
        $first = DB::transaction(fn () => ShareInstallation::lockForAdmission());
        $second = DB::transaction(fn () => ShareInstallation::lockForAdmission());

        $this->assertSame($first->id, $second->id);
        $this->assertSame(1, ShareInstallation::query()->readAll('the installation has one row')->count());
    }

    public function test_a_gateway_configuration_endpoint_and_operation_are_made_through_their_methods(): void
    {
        $configuration = $this->configuration();
        $endpoint = ShareGatewayEndpoint::openFor($configuration, 1, 'run-1');
        $operation = ShareGatewayOperation::request($configuration, GatewayOperationType::Open);

        $this->assertEquals($configuration->settings, ShareGatewayConfiguration::query()->findOrFail($configuration->id)->settings);
        $this->assertSame('press', $configuration->toConfiguration()->settings->gatewayKey);
        $this->assertSame('https://share.example.test', $endpoint->public_origin);
        $this->assertSame(GatewayEndpointState::Opening, $endpoint->fresh()?->state);
        $this->assertSame(GatewayOperationType::Open, $operation->fresh()?->type);
        $this->assertSame($configuration->configuration_version, $operation->configuration_version);
        $this->assertNull($operation->share_gateway_endpoint_id);
    }

    public function test_a_preview_keeps_its_selection_and_a_checksum_over_it(): void
    {
        $configuration = $this->configuration();
        $target = new ShareSelectedTarget(TestActors::record('documents.document', 2), TestIds::of(3), '4');
        $preview = SharePreview::createFor(TestIds::of(9), $this->root(), [$target], $configuration);
        $other = SharePreview::createFor(TestIds::of(9), $this->root(), [], $configuration);

        $this->assertEquals([$target], SharePreview::query()->findOrFail($preview->id)->selection);
        $this->assertSame(64, strlen($preview->checksum));
        $this->assertNotSame($preview->checksum, $other->checksum);
        $this->assertEquals($this->root(), $preview->root());
    }

    public function test_a_share_never_serializes_its_token_and_stores_it_encrypted(): void
    {
        $token = ShareToken::generate();
        $share = Share::grant($this->root(), TestIds::of(9), $this->configuration(), $token, CarbonImmutable::now()->addDays(7));
        $stored = Share::query()->findOrFail($share->id);

        $this->assertSame(ShareState::Pending, $stored->state);
        $this->assertArrayNotHasKey('token_digest', $stored->toArray());
        $this->assertArrayNotHasKey('token_ciphertext', $stored->toArray());
        $this->assertStringNotContainsString($token->token, $stored->toJson());
        $this->assertSame($token->token, $stored->token_ciphertext);
        $this->assertNotSame($token->token, $stored->getRawOriginal('token_ciphertext'));
        $this->assertSame(ShareToken::digestOf($token->token), $stored->token_digest);
    }

    public function test_a_proposal_member_and_audit_are_made_through_their_methods(): void
    {
        $proposal = Share::propose($this->root(), TestActors::agentIdentity(5), CarbonImmutable::now()->addDays(7));
        $member = ShareMember::approve($proposal, $this->root(), new ShareSelectedTarget(TestActors::record('documents.report', 7), TestIds::of(8), '1'));
        $audit = ShareAudit::recordFor($proposal, ShareAuditType::Created, TestActors::agentIdentity(5), null);
        $change = ShareAudit::recordForInstallation(ShareAuditType::GatewayChanged, TestActors::userIdentity(9), 'disabled');

        $this->assertSame(ShareState::Proposed, $proposal->fresh()?->state);
        $this->assertNull($proposal->token_digest);
        $this->assertSame(0, $member->scope_version);
        $this->assertEquals(TestActors::record('documents.report', 7), $member->target());
        $this->assertSame($proposal->id, $audit->share_id);
        $this->assertNull($change->share_id);
        $this->assertSame(ShareAuditType::GatewayChanged, $change->fresh()?->type);
    }

    private function root(): RecordIdentity
    {
        return TestActors::record('documents.document', 1);
    }

    private function configuration(): ShareGatewayConfiguration
    {
        return ShareGatewayConfiguration::configure(new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, ['press-login']));
    }
}
