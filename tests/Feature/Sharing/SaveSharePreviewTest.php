<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Bus\Contracts\CommandBus;
use App\Domains\Support\Domain;
use App\Links\Models\Link;
use App\Reads\Contracts\ReadMeter;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\SaveSharePreview;
use App\Sharing\Contracts\ProvidesShareGateways;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Exceptions\ShareGatewayUnavailable;
use App\Sharing\Exceptions\SharePreviewRefused;
use App\Sharing\Exceptions\SharingNotAllowed;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\SharePreview;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\MeteredShareBudget;
use App\Sharing\Support\SavedSharePreview;
use App\Sharing\Support\ShareCandidates;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;
use App\Sharing\Support\ShareScope;
use App\Sharing\Support\ShareSelectedTarget;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner saves a preview of a root with some of its linked candidates and gets a checksum; anyone else is refused,
 * and the preview is consumed once, only while its selection still shows the same links and published versions.
 */
final class SaveSharePreviewTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private RecordIdentity $root;

    private ShareGatewayConfiguration $configuration;

    private BinderPublications $publications;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(new BindersDomain);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(9)));
        $this->publications = new BinderPublications;
        $this->app->instance(BinderPublications::class, $this->publications);
        $this->configuration = ShareGatewayConfiguration::configure(new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []));
        $this->root = new RecordIdentity('binders.binder', TestIds::of(1));

        foreach ([101, 102, 103] as $number) {
            Link::query()->create(['source_type' => $this->root->type, 'source_id' => $this->root->id, 'target_type' => 'binders.sheet', 'target_id' => TestIds::of($number)]);
        }
    }

    public function test_the_owner_saves_a_preview_of_two_of_three_candidates_with_its_checksum(): void
    {
        $saved = $this->save([TestIds::of(101), TestIds::of(103)]);
        $preview = SharePreview::query()->findOrFail($saved->previewId);

        $this->assertCount(3, $saved->candidates->linked);
        $this->assertSame($preview->checksum, $saved->checksum);
        $this->assertSame([TestIds::of(101), TestIds::of(103)], array_map(fn (ShareSelectedTarget $target) => $target->record->id, $preview->selection));
        $this->assertSame($this->configuration->configuration_version, $preview->configuration_version);
    }

    public function test_a_user_who_is_not_the_owner_is_refused(): void
    {
        $this->startUserRequestAs(TestIds::of(8));

        $this->expectException(SharingNotAllowed::class);

        $this->app->make(CommandBus::class)->run(new SaveSharePreview($this->root->type, $this->root->id, [], $this->configuration->id));
    }

    public function test_without_a_default_gateway_a_preview_names_one(): void
    {
        $this->startUserRequestAs(TestIds::of(9));

        $this->expectExceptionObject(ShareGatewayUnavailable::noDefault());

        $this->app->make(CommandBus::class)->run(new SaveSharePreview($this->root->type, $this->root->id, []));
    }

    public function test_a_preview_is_consumed_once_while_its_selection_is_unchanged(): void
    {
        $saved = $this->save([TestIds::of(101)]);
        $preview = SharePreview::query()->findOrFail($saved->previewId);

        $this->assertCount(1, $preview->consumeFor(TestIds::of(9), $saved->checksum, $this->current()));
        $this->assertThrows(fn () => $preview->consumeFor(TestIds::of(9), $saved->checksum, $this->current()), SharePreviewRefused::class, 'used already');
    }

    public function test_a_changed_publication_version_a_wrong_checksum_and_another_owner_are_refused(): void
    {
        $saved = $this->save([TestIds::of(101), TestIds::of(102)]);
        $preview = SharePreview::query()->findOrFail($saved->previewId);

        $this->assertThrows(fn () => $preview->consumeFor(TestIds::of(8), $saved->checksum, $this->current()), SharePreviewRefused::class, 'another owner');
        $this->assertThrows(fn () => $preview->consumeFor(TestIds::of(9), str_repeat('0', 64), $this->current()), SharePreviewRefused::class, 'has changed');

        $this->publications->publish(TestIds::of(102), '2');

        $this->assertThrows(fn () => $preview->consumeFor(TestIds::of(9), $saved->checksum, $this->current()), SharePreviewRefused::class, 'has changed');
    }

    /**
     * @param  list<string>  $selectedIds
     */
    private function save(array $selectedIds): SavedSharePreview
    {
        $this->startUserRequestAs(TestIds::of(9));

        return $this->app->make(CommandBus::class)->run(new SaveSharePreview($this->root->type, $this->root->id, $selectedIds, $this->configuration->id));
    }

    private function current(): ShareCandidates
    {
        return $this->app->make(ShareScope::class)->discover($this->root, MeteredShareBudget::forPreview($this->app->make(ReadMeter::class)));
    }

    /**
     * Registers a fixture domain's share records and gateways as the sharing provider does at boot.
     */
    private function registerShareDomain(Domain $domain): void
    {
        if ($domain instanceof ProvidesShareRecords) {
            $this->app->make(ShareRecordRegistry::class)->registerFrom($domain);
        }

        if ($domain instanceof ProvidesShareGateways) {
            $this->app->make(ShareGatewayRegistry::class)->registerFrom($domain);
        }
    }
}
