<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Commands\Sharing\SaveSharePreview\SaveSharePreviewCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Reads\ReadMeter;
use App\Exceptions\ShareGatewayUnavailable;
use App\Exceptions\SharePreviewRefused;
use App\Exceptions\SharingNotAllowed;
use App\Models\Records\Link;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\SharePreview;
use App\Support\GatewaySettings;
use App\Support\MeteredShareBudget;
use App\Support\RecordIdentity;
use App\Support\SavedSharePreview;
use App\Support\ShareCandidates;
use App\Support\ShareRecordRegistry;
use App\Support\ShareScope;
use App\Support\ShareSelectedTarget;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner saves a preview of a root with some of its linked candidates and gets a checksum; anyone else is refused,
 * and the preview is consumed once, only while its selection still shows the same links and published versions.
 */
final class SaveSharePreviewTest extends TestCase
{
    use RefreshHookDatabase;
    use RegistersShareDomains;
    use StartsAgentRequests;

    private RecordIdentity $root;

    private ShareGatewayConfiguration $configuration;

    private BinderPublications $publications;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(BindersDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(9));
        $this->publications = new BinderPublications();
        $this->app->instance(BinderPublications::class, $this->publications);
        $this->configuration = ShareGatewayConfiguration::create(
            new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []),
        );
        $this->root = TestActors::record('binders.binder', 1);

        foreach ([101, 102, 103] as $number) {
            Link::createForColumns($this->root->type, $this->root->id, 'binders.sheet', TestIds::of($number));
        }
    }

    public function test_the_owner_saves_a_preview_of_two_of_three_candidates_with_its_checksum(): void
    {
        $saved = $this->save([TestIds::of(101), TestIds::of(103)]);
        $preview = SharePreview::query()->findOrFail($saved->previewId);

        $this->assertCount(3, $saved->candidates->linked);
        $this->assertSame($preview->checksum, $saved->checksum);
        $this->assertSame(
            [TestIds::of(101), TestIds::of(103)],
            array_map(fn (ShareSelectedTarget $target) => $target->record->id, $preview->selection),
        );
        $this->assertSame($this->configuration->configuration_version, $preview->configuration_version);
    }

    public function test_a_user_who_is_not_the_owner_is_refused(): void
    {
        $this->startTestUserRequest(8);
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(9));

        $this->expectException(SharingNotAllowed::class);

        $this->app->make(CommandBus::class)->run(
            new SaveSharePreviewCommand($this->root->type, $this->root->id, [], $this->configuration->id),
        );
    }

    public function test_without_a_default_gateway_a_preview_names_one(): void
    {
        $this->startTestUserRequest(9);

        $this->expectExceptionObject(ShareGatewayUnavailable::noDefault());

        $this->app->make(CommandBus::class)->run(new SaveSharePreviewCommand($this->root->type, $this->root->id, []));
    }

    public function test_a_preview_is_consumed_once_while_its_selection_is_unchanged(): void
    {
        $saved = $this->save([TestIds::of(101)]);
        $preview = SharePreview::query()->findOrFail($saved->previewId);

        $this->assertCount(1, $preview->consumeFor(TestIds::of(9), $saved->checksum, $this->current()));
        $this->assertThrows(
            fn () => $preview->consumeFor(TestIds::of(9), $saved->checksum, $this->current()),
            SharePreviewRefused::class,
            SharePreviewRefused::consumed($saved->previewId)->getMessage(),
        );
    }

    public function test_a_changed_publication_version_a_wrong_checksum_and_another_owner_are_refused(): void
    {
        $saved = $this->save([TestIds::of(101), TestIds::of(102)]);
        $preview = SharePreview::query()->findOrFail($saved->previewId);

        $this->assertThrows(
            fn () => $preview->consumeFor(TestIds::of(8), $saved->checksum, $this->current()),
            SharePreviewRefused::class,
            SharePreviewRefused::foreign($saved->previewId)->getMessage(),
        );
        $this->assertThrows(
            fn () => $preview->consumeFor(TestIds::of(9), str_repeat('0', 64), $this->current()),
            SharePreviewRefused::class,
            SharePreviewRefused::changed($saved->previewId)->getMessage(),
        );

        $this->publications->publish(TestIds::of(102), '2');

        $this->assertThrows(
            fn () => $preview->consumeFor(TestIds::of(9), $saved->checksum, $this->current()),
            SharePreviewRefused::class,
            SharePreviewRefused::changed($saved->previewId)->getMessage(),
        );
    }

    /**
     * @param  list<string>  $selectedIds
     */
    private function save(array $selectedIds): SavedSharePreview
    {
        $this->startTestUserRequest(9);

        return $this->app->make(CommandBus::class)->run(
            new SaveSharePreviewCommand($this->root->type, $this->root->id, $selectedIds, $this->configuration->id),
        );
    }

    private function current(): ShareCandidates
    {
        return $this->app->make(ShareScope::class)->discover(
            $this->root,
            MeteredShareBudget::forPreview($this->app->make(ReadMeter::class)),
        );
    }
}
