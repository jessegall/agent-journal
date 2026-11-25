<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Reads\ReadMeter;
use App\Exceptions\SharingNotAllowed;
use App\Models\Records\Link;
use App\Support\GatewaySettings;
use App\Support\RecordIdentity;
use App\Support\ShareRecordRegistry;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Exceptions\ShareGatewayUnavailable;
use Domain\Sharing\Exceptions\SharePreviewRefused;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\SharePreview;
use Domain\Sharing\Support\SavedSharePreview;
use Domain\Sharing\Support\ShareBudget;
use Domain\Sharing\Support\ShareCandidates;
use Domain\Sharing\Support\ShareScope;
use Domain\Sharing\Support\ShareSelectedTarget;
use Domain\Sharing\Tests\TestCase;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\TestActors;
use Tests\Support\TestIds;

/**
 * The owner saves a preview of a root with some of its linked candidates and gets a checksum; anyone else is refused,
 * and the preview is consumed once, only while its selection still shows the same links and published versions.
 */
final class SaveSharePreviewTest extends TestCase
{
    use RefreshHookDatabase;
    use RegistersShareDomains;

    private RecordIdentity $root;

    private ShareGatewayConfiguration $configuration;

    private BinderPublications $publications;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(BindersDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $this->journal->owner();
        $this->publications = new BinderPublications();
        $this->app->instance(BinderPublications::class, $this->publications);
        $this->configuration = ShareGatewayConfiguration::create(
            new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []),
        );
        $this->root = TestActors::record('binders.binder', 1);

        foreach ([
            101,
            102,
            103,
        ] as $number) {
            Link::create($this->root->type, $this->root->id, 'binders.sheet', TestIds::of($number));
        }
    }

    public function test_the_owner_saves_a_preview_of_two_of_three_candidates_with_its_checksum(): void
    {
        $saved = $this->save([
            TestIds::of(101),
            TestIds::of(103),
        ]);
        $preview = SharePreview::query()->findOrFail($saved->previewId);

        $this->assertCount(3, $saved->candidates->linked);
        $this->assertSame($preview->checksum, $saved->checksum);
        $this->assertSame(
            [
                TestIds::of(101),
                TestIds::of(103),
            ],
            array_map(fn (ShareSelectedTarget $target) => $target->record->id, $preview->selection->items()),
        );
        $this->assertSame($this->configuration->configuration_version, $preview->configuration_version);
    }

    public function test_a_user_who_is_not_the_owner_is_refused(): void
    {
        $this->journal->actAsUserId(TestIds::of(8));

        $this->expectException(SharingNotAllowed::class);

        $this->app->make(CommandBus::class)->run(
            new SaveSharePreviewCommand($this->root->type, $this->root->id, [], $this->configuration->id),
        );
    }

    public function test_without_a_default_gateway_a_preview_names_one(): void
    {
        $this->journal->actAsUserId($this->journal->ownerUser()->id);

        $this->expectExceptionObject(ShareGatewayUnavailable::noDefault());

        $this->app->make(CommandBus::class)->run(new SaveSharePreviewCommand($this->root->type, $this->root->id, []));
    }

    public function test_a_preview_is_consumed_once_while_its_selection_is_unchanged(): void
    {
        $saved = $this->save([TestIds::of(101)]);
        $preview = SharePreview::query()->findOrFail($saved->previewId);

        $this->assertCount(
            1,
            $preview->consumeFor($this->journal->ownerUser()->id, $saved->checksum, $this->current()),
        );
        $this->assertThrows(
            fn () => $preview->consumeFor($this->journal->ownerUser()->id, $saved->checksum, $this->current()),
            SharePreviewRefused::class,
            SharePreviewRefused::consumed($saved->previewId)->getMessage(),
        );
    }

    public function test_a_changed_publication_version_a_wrong_checksum_and_another_owner_are_refused(): void
    {
        $saved = $this->save([
            TestIds::of(101),
            TestIds::of(102),
        ]);
        $preview = SharePreview::query()->findOrFail($saved->previewId);

        $this->assertThrows(
            fn () => $preview->consumeFor(TestIds::of(8), $saved->checksum, $this->current()),
            SharePreviewRefused::class,
            SharePreviewRefused::foreign($saved->previewId)->getMessage(),
        );
        $this->assertThrows(
            fn () => $preview->consumeFor($this->journal->ownerUser()->id, str_repeat('0', 64), $this->current()),
            SharePreviewRefused::class,
            SharePreviewRefused::changed($saved->previewId)->getMessage(),
        );

        $this->publications->publish(TestIds::of(102), '2');

        $this->assertThrows(
            fn () => $preview->consumeFor($this->journal->ownerUser()->id, $saved->checksum, $this->current()),
            SharePreviewRefused::class,
            SharePreviewRefused::changed($saved->previewId)->getMessage(),
        );
    }

    /**
     * @param  list<string>  $selectedIds
     */
    private function save(array $selectedIds): SavedSharePreview
    {
        $this->journal->actAsUserId($this->journal->ownerUser()->id);

        return $this->app->make(CommandBus::class)->run(
            new SaveSharePreviewCommand($this->root->type, $this->root->id, $selectedIds, $this->configuration->id),
        );
    }

    private function current(): ShareCandidates
    {
        return $this->app->make(ShareScope::class)->discover(
            $this->root,
            ShareBudget::forPreview($this->app->make(ReadMeter::class)),
        );
    }
}
